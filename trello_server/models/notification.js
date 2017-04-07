var mongoose = require('mongoose');
var Card = require('./card');
 
var NotificationSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: false,
        required: true
    },
    boardID: {
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

module.exports = mongoose.model('Notification', NotificationSchema);