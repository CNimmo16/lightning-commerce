const Category = require('../models/category');
const Product = require('../models/product');
const Order = require('../models/order');
const Customer = require('../models/customer');
const ShippingMethod = require('../models/shippingMethod');

const cors = require('@koa/cors');

const fs = require('fs-extra')
const path = require("path")

const stripe = require('stripe')(process.env.STRIPE_SECRET);

module.exports = ({ router }) => {
    // fetch all products, option to filter
    router.get("/products", async (ctx, next) => {
        const query = { live: true };
        // if(categories) { query["category.id"] = {$in: categories} }
        // if(priceRange) { query["inventory.price"] = { $gte: priceRange[0], $lte: priceRange[1] } }
        const perPage = 15
        const options = { sort: {"content.name": "descending"}, skip: ctx.request.query.page*perPage, limit: perPage }
        const products = await Product.find(query, null, options)
        const count = await Product.estimatedDocumentCount()
        const pages = Math.floor(count / perPage) + 1
        if(!products) {
            ctx.status = 404;
            return next();
        } else {
            // still returns empty array if no products found
            ctx.body = {
                products,
                pages
            }
        }
    })
    
    // fetch single product by slug and category
    router.get("/products/:category/:product", async (ctx, next) => {
        try {
            const product = await Product.findOne({
                "category.slug": ctx.params.category,
                "content.slug": ctx.params.product
            })
            if(!product) {
                ctx.status = 404;
                return next()
            } else {
                ctx.body = {
                    product: product
                }
            }
        }
        catch(err) {
            ctx.status = 400;
            ctx.body = "invalid product id";
            return next()
        }
    })
    
    // get shipping methods
    router.get("/shipping-methods", async (ctx, next) => {
        const methods = await ShippingMethod.find();
        ctx.body = methods;
    });
    
    // ========= PAYMENT HANDLING LOGIC ==========
    
    // Create payment intent as soon as customer proceeds to checkout stage
    router.post("/orders/intent", async (ctx, next) => {
        const amount = Math.round(ctx.request.fields.amount)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: ctx.request.fields.currency,
        });
        ctx.body = {
            paymentIntent: {
                id: paymentIntent.id,
                client_secret: paymentIntent.client_secret
            }
        }
    })
    
    // update existing payment intent either due to a cart items change or adding cost of shipping
    router.put("/orders/intent", async (ctx, next) => {
        let toUpdate = {
            amount: ctx.request.fields.amount
        }
        if(ctx.request.fields.currency) { 
            toUpdate.currency = ctx.request.fields.currency 
        }
        await stripe.paymentIntents.update(ctx.request.fields.id, toUpdate)
        ctx.body = "successfully updated payment intent amount";
    })
    
    // Price manipulation prevention
    router.post("/orders/validate", async (ctx, next) => {
        const order = ctx.request.fields.order
        console.log(order)
        const foundIntent = await stripe.paymentIntents.retrieve(order.paymentIntent.id);
        
        // calculate expected cost based on cart items
        let orderItems = []
        const getItems = order.items.map(async (cartItem) => {
            const product = await Product.findById(cartItem.product._id);
            // check that there is enough stock to fulfill order
            if(product.inventory.totalStock - product.inventory.inFulfillment < cartItem.quantity) {
                throw new Error("Too little stock for order to be fulfilled")
            }
            orderItems.push({
                product: product,
                quantity: cartItem.quantity
            })
        });
        await Promise.all(getItems)
        let expectedTotal = orderItems.reduce((accumulator, item) => {
            return accumulator + item.product.inventory.price * item.quantity
        }, 0)
        const shippingMethod = await ShippingMethod.findOne({name: order.shippingMethod.name})
        expectedTotal += shippingMethod.cost;
        
        // cancel order if amounts do not match or payment intents are not identical
        if(expectedTotal * 100 !== foundIntent.amount || foundIntent.client_secret !== order.paymentIntent.client_secret) {
            await stripe.paymentIntents.cancel(foundIntent.id, { cancellation_reason: "fraudulent" })
            throw new Error("Error with order pricing validation")
        } else {
            ctx.body = "Order valid"
        }
    })
    
    // Create new order and confirm payment can be finalised
    router.post("/orders", async (ctx, next) => {
        const order = ctx.request.fields.order
        const foundIntent = await stripe.paymentIntents.retrieve(order.paymentIntent.id);
        let orderItems = []
        const getItems = order.items.map(async (cartItem) => {
            const product = await Product.findById(cartItem.product._id);
            // check that there is enough stock to fulfill order
            if(product.inventory.totalStock - product.inventory.inFulfillment < cartItem.quantity) {
                throw new Error("Too little stock for order to be fulfilled")
            }
            orderItems.push({
                product: product,
                quantity: cartItem.quantity
            })
        });
        await Promise.all(getItems)
        const newOrder = await Order.create({
            customer: {
                email: order.email,
                billingAddress: order.billingAddress
            },
            items: orderItems,
            costs: {
                subtotal: order.subtotal,
                shipping: order.shippingMethod.cost,
                grandTotal: order.total
            },
            fulfillment: {
                orderStatus: "Pending payment",
                shippingMethod: order.shippingMethod,
                shippingAddress: order.shippingAddress
            },
            payment: {
                method: "card",
                provider: "stripe",
                transactionId: foundIntent.id,
                paymentCard: {
                    last4: null,
                    brand: null
                },
                invoiceURL: null,
                paymentStatus: "pending",
                amount: foundIntent.amount
            },
        })
        // reduce product stock
        const updateStock = orderItems.map(async (item) => {
            item.product.inventory.inFulfillment += item.quantity
            await item.product.save()
        });
        await Promise.all(updateStock)
        // create or update customer
        let customer = await Customer.findOneAndUpdate({ "contact.email": order.email }, { $push: { orders: newOrder } })
        if(!customer) {
            customer = await Customer.create({
                billingAddress: order.billingAddress,
                contact: {
                    email: order.email
                },
                orders: [newOrder]
            })
        }
        ctx.body = "order created, awaiting payment confirmation to move to fulfillment"
    })
};