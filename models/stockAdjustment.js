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

module.exports = mongoose.model('StockAdjustment', stockAdjustmentSchema);