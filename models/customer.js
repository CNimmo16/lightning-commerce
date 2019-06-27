const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
    contact: {
        email: String
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
});

module.exports = mongoose.model('Customer', customerSchema);