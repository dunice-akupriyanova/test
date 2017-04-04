var mongoose = require('mongoose');
var List = require('./list');
 
// var BoardSchema = new mongoose.Schema({ 
//     name: {
//         type: String,
//         unique: false,
//         required: true
//     },
//     lists: {
//         type: [{
//             name: {
//                 type: String,
//                 unique: false
//             },
//             cards: {
//                 type: [{
//                     name: String,
//                     description: String,
//                     date: String
//                 }],
//                 unique: false
//             }
//         }],
//         unique: false
//     }
// });

var BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true
    },
    // lists: [{ type: Object, ref: 'List', required: false }]
    lists: [List]
});


module.exports = mongoose.model('Board', BoardSchema);