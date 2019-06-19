const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    content: {
        name: String,
        slug: String,
        description: String,
        images: Array,
    },
    inventory: {
        totalStock: Number,
        inFulfillment: Number,
        price: Number
    },
    shipping: {
        weight: Number,
        height: Number,
        width: Number,
        length: Number
    },
    category: {
        name: String,
        slug: String,
        id: String
    }
});

module.exports = mongoose.model('Product', productSchema);