const mongoose = require('mongoose');

const setupSchema = new mongoose.Schema({
    primaryCurrency: {
        name: String,
        symbol: String
    },
    usableCurrencies: [
        {
            name: String,
            symbol: String
        }    
    ],
    paymentProvider: {
        
    }
});

module.exports = mongoose.model('Setup', setupSchema);