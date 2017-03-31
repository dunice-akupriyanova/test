var mongoose = require('mongoose');

var RightSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: false,
        required: true
    },
    boardID: {
        type: String,
        unique: false,
        required: true
    },
    rights: {
        type: String,
        required: true,
        unique: false
    },
});

module.exports = mongoose.model('Right', RightSchema);