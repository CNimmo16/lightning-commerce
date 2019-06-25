const Category = require('../../models/category');
const Product = require('../../models/product');
const StockAdjustment = require('../../models/stockAdjustment');

const fs = require('fs-extra')
const path = require("path")

module.exports = ({ router }) => {
    // Adjust stock
    router.post("/inventory", async (ctx, next) => {
        const data = ctx.request.fields;
        
        const adjustment = await StockAdjustment.create(data)
        if(!adjustment) {
            throw new Error("Unknown error creating adjustment");
        } else {
            ctx.body = adjustment
        }
    })
    
    // Get stock adustment list
    router.get("/inventory", async (ctx, next) => {
        const reasons = ctx.request.query.reason;
        const page = ctx.request.query.page;
        const daterange = ctx.request.query.daterange;
        daterange[0] = new Date(Number(daterange[0]))
        daterange[1] = new Date(Number(daterange[1]))
        const query = {
            reason: {$in: reasons},
            datetime: { $gte: daterange[0], $lte: daterange[1] }
        }
        const options = { sort: {"datetime": "descending"}, skip: page*15, limit: 15 }
        const adjustments = await StockAdjustment.find(query, null, options)
        const count = await StockAdjustment.estimatedDocumentCount()
        const pages = Math.floor(count / 15) + 1
        if(!adjustments) {
            throw new Error("Error loading stock adjustments");
        } else {
            ctx.body = {
                adjustments,
                pages
            }
        }
    })
};