var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        unique: false,
        required: false
    },
    author: {
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

module.exports = CommentSchema;