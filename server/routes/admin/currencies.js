const Category = require('../../models/category');
const Product = require('../../models/product');
const StockAdjustment = require('../../models/stockAdjustment');
const Setup = require('../../models/setup');

const fs = require('fs-extra')
const path = require("path")

module.exports = ({ router }) => {
    // Get current setup
    router.get("/setup", async (ctx, next) => {
        const setup = await Setup.findOne()
        ctx.body = setup;
    })
    
    // Set primary currency
    router.put("/currencies/primary", async (ctx, next) => {
        await Setup.findOneAndUpdate({}, { useFindAndModify: false }, { primaryCurrency: ctx.request.fields })
        ctx.body = "successfully updated"
    })
};