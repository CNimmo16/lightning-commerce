const Category = require('../../models/category');
const Product = require('../../models/product');
const ShippingMethod = require('../../models/shippingMethod');

const fs = require('fs-extra')
const path = require("path")

module.exports = ({ router }) => {
    // Add shipping method
    router.post("/orders/methods", async (ctx, next) => {
        const method = await ShippingMethod.create(ctx.request.fields)
        ctx.body = method
    });
};