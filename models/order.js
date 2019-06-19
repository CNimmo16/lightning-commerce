const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    payment: {
        invoiceNumber: String,
        paymentCard: {
            digits: Number,
            provider: String
        },
        paymentStatus: String,
        totalValue: Number
    },
    fulfillment: {
        orderStatus: String,
        shippingMethod: String,
    }
});

module.exports = mongoose.model('Order', orderSchema);