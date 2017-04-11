var mongoose = require('mongoose');
var List = require('./list');
 
var BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    lists: {
        type: [List],
        unique: false,
        required: false
    }
});

module.exports = mongoose.model('Board', BoardSchema);