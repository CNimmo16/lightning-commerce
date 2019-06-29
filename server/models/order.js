const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    customer: {
        email: String,
        billingAddress: {
            firstName: String,
            lastName: String,
            address: String,
            company: String,
            flatNumber: String,
            city: String,
            country: {
                name: String,
                code: String
            },
            postcode: String,
            phone: String
        },
    },
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
        method: String,
        provider: String,
        transactionId: String,
        paymentCard: {
            last4: Number,
            brand: String
        },
        invoiceURL: String,
        paymentStatus: String,
        amount: Number
    },
    fulfillment: {
        orderStatus: String,
        shippingMethod: {
            name: String,
            cost: Number,
            days: Array,
            targetHours: Number
        },
        shippingAddress: {
            firstName: String,
            lastName: String,
            address: String,
            company: String,
            flatNumber: String,
            city: String,
            country: {
                name: String,
                code: String
            },
            postcode: String,
            phone: String
        },
    }
});

module.exports = mongoose.model('Order', orderSchema);