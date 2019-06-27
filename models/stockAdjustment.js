const mongoose = require('mongoose');

const stockAdjustmentSchema = new mongoose.Schema({
    datetime: { type: Date, default: Date.now() },
    products: [{
        id: { type: mongoose.Schema.Types.ObjectId },
        name: String,
        previousTotalStock: Number,
        previousAvailableStock: Number,
        change: Number,
        newTotalStock: Number,
        newAvailableStock: Number
    }],
    type: String,
    reason: String,
    notes: String,
});

// Automatically adjust stock when stock adjustment created
const Product = require('../models/product');
const StockAdjustment = require('../models/stockAdjustment');

stockAdjustmentSchema.post('save', async (adjustment) => {
    const updateStock = adjustment.products.map(async (staticProduct) => {
        const product = await Product.findById(staticProduct.id);
        if(product.inventory.totalStock !== staticProduct.previousTotalStock || product.inventory.totalStock - product.inventory.inFulfillment !== staticProduct.previousAvailableStock) {
            StockAdjustment.findByIdAndDelete(adjustment.id)
        } else {
            product.inventory.totalStock = staticProduct.newTotalStock
            await product.save()
        }
    });
    await Promise.all(updateStock)
});

module.exports = mongoose.model('StockAdjustment', stockAdjustmentSchema);