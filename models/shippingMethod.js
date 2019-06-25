const mongoose = require('mongoose');

const shippingMethodSchema = new mongoose.Schema({
    name: String,
    days: Array,
    cost: Number
});

module.exports = mongoose.model('ShippingMethod', shippingMethodSchema);