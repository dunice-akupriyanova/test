var mongoose = require('mongoose');
var Card = require('./card');

var ListSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    cards: {
        type: [Card],
        unique: false,
        required: false
    }
});

module.exports = ListSchema;