const Category = require('../../models/category');
const Product = require('../../models/product');
const Order = require('../../models/order');
const ShippingMethod = require('../../models/shippingMethod');

const fs = require('fs-extra')
const path = require("path")

module.exports = ({ router }) => {
    // Add shipping method
    router.post("/orders/methods", async (ctx, next) => {
        const method = await ShippingMethod.create(ctx.request.fields)
        ctx.body = method
    });
    
    // get orders
    router.get("/orders", async (ctx, next) => {
        const perPage = 15
        const options = { sort: {"content.name": "descending"}, skip: ctx.request.query.page*perPage, limit: perPage }
        const orders = await Order.find({}, null, options)
        const count = await Order.estimatedDocumentCount()
        const pages = Math.floor(count / perPage) + 1  
        ctx.body = {
            orders,
            pages
        }
    })
};