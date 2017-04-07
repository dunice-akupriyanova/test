var mongoose = require('mongoose');
var Comment = require('./comment');

var CardSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
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
    },
    comments: {
        type: [Comment],
        required: false,
        unique: false,
    }
});

module.exports = CardSchema;