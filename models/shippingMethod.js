const mongoose = require('mongoose');

const shippingMethodSchema = new mongoose.Schema({
    name: String,
    days: Array,
    cost: Number,
    targetHours: Number
});

module.exports = mongoose.model('ShippingMethod', shippingMethodSchema);