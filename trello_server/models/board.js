var mongoose = require('mongoose');
var List = require('./list');
 
var BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    lists: [List]
});

module.exports = mongoose.model('Board', BoardSchema);