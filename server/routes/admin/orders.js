const Category = require('../../models/category');
const Product = require('../../models/product');
const Order = require('../../models/order');
const ShippingMethod = require('../../models/shippingMethod');

const fs = require('fs-extra')
const path = require("path")

module.exports = ({ router }) => {
    // Get shipping methods
    router.get("/shipping-methods", async (ctx, next) => {
        const methods = await ShippingMethod.find()
        ctx.body = {
            methods: methods
        }
    });
    
    // Add shipping method
    router.post("/shipping-methods", async (ctx, next) => {
        const method = await ShippingMethod.create(ctx.request.fields)
        ctx.body = method
    });
    
    // Delete shipping method
    router.del("/shipping-methods/:id", async (ctx, next) => {
        try {
            await ShippingMethod.findByIdAndRemove(ctx.params.id)
            ctx.body = "Successfully deleted product"
        }
        catch(err) {
            throw new Error("Unknown error deleting product");
        }
    })
    
    // get all orders
    router.get("/orders", async (ctx, next) => {
        const perPage = 15
        const options = { sort: {"date": "descending"}, skip: ctx.request.query.page*perPage, limit: perPage }
        const orders = await Order.find({}, null, options)
        const count = await Order.estimatedDocumentCount()
        const pages = Math.floor(count / perPage) + 1  
        ctx.body = {
            orders,
            pages
        }
    })
    
    // get orders that need fulfilled
    router.get("/orders/fulfillment", async (ctx, next) => {
        let orders = await Order.find({ "fulfillment.orderStatus": "Awaiting fulfillment" }).populate("items.product").exec()
        // add data about remaining time before fulfillment deadline
        orders = orders.map((order) => {
            order = order.toObject()
            const targetUnix = new Date(order.date).getTime() + order.fulfillment.shippingMethod.targetHours * 3600000
            const remaining = (targetUnix - Date.now());
            if(Math.abs(remaining) > 3600000) {
                order.timeRemaining = Math.floor(remaining / 3600000) + " hours"
            } else {
                order.timeRemaining = Math.floor(remaining / 60000) + " minutes";
            }
            return order
        })
        ctx.body = {
            orders: orders
        }
    })

    // fulfill order
    router.put("/orders/:id", async (ctx, next) => {
        const order = await Order.findById(ctx.params.id).populate("items.product").exec()
        order.fulfillment.orderStatus = ctx.request.fields.status;
        order.save();
        ctx.body = "Fulfilled order"
    })
    
    // get order by id
    router.get("/orders/:id", async (ctx, next) => {
        const order = await Order.findById(ctx.params.id).populate("items.product").exec()
        ctx.body = {
            order: order
        }
    })
};