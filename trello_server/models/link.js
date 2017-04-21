var mongoose = require('mongoose');

var LinkSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: false,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model('Link', LinkSchema);