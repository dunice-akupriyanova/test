var mongoose = require('mongoose');

var NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        unique: false,
        required: true
    },
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
    cardID: {
        type: String,
        unique: false,
        required: false
    },
    overlooked: {
        type: Boolean,
        unique: false,
        required: false
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);