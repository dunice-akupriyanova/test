var express = require('express');
var app = express();
module.exports = function(app, db) {
  app.post('/notes', (req, res) => {
    console.log(req.body);
    // Здесь будем создавать заметку.
    res.send('Hello');
  });
};