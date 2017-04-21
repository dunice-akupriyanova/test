var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
var User = require('./models/user');
var db = mongoose.connection;
var cors = require('cors');

mongoose.connect('mongodb://localhost/trello-dev');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected!");
});

var users = require('./routes/users');
var auth = require('./routes/auth');
var boards = require('./routes/boards');

require('./websockets');

var app = express();

app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', users);
app.use('/auth', auth);
app.use('/boards', boards);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    if ((err.message == 'Expiry time is over') || (err.message == 'User not found')) {
        err.status = 401;
    }
    res.status(err.status || 500).send({
        status: err.status ? err.status : 500,
        message: err.message,
        error: err.stack
    });
});

module.exports = app;