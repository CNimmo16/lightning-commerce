const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: Number
    }],
    costs: {
        subtotal: Number,
        shipping: Number,
        grandTotal: Number
    },
    payment: {
        provider: String,
        stripe: {
            paymentIntentId: String,
        },
        paymentCard: {
            digits: Number,
            issuer: String
        },
        paymentStatus: String,
        amount: Number
    },
    fulfillment: {
        orderStatus: String,
        shippingMethod: String,
    }
});

module.exports = mongoose.model('Order', orderSchema);