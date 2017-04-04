var mongoose = require('mongoose');

var CardSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    description: {
        type: String,
        required: false,
        unique: false,
    },
    date: {
        type: String,
        required: false,
        unique: false,
    }
});

module.exports = CardSchema;