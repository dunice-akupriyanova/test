var mongoose = require('mongoose');
 
var BoardSchema = new mongoose.Schema({ 
    name: {
        type: String,
        unique: false,
        required: true
    },
    lists: {
        type: [{
            name: {
                type: String,
                unique: false
            },
            cards: {
                type: [{
                    name: String,
                    description: String,
                    date: String
                }],
                unique: false
            }
        }],
        unique: false
    }
});

module.exports = mongoose.model('Board', BoardSchema);