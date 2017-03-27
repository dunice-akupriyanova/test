var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
var User = require('./models/user');
var session = require('express-session');

var db = mongoose.connection;

var cors = require('cors');


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

mongoose.connect('mongodb://localhost/trello-dev');






var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
// app.use(bodyParser());
app.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);



var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;





app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password, done){
  User.findOne({ username : username},function(err,user){
    return err 
      ? done(err)
      : user
        ? password === user.password
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password.' })
        : done(null, false, { message: 'Incorrect username.' });
  });
}));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err 
      ? done(err)
      : done(null,user);
  });
});


app.post('/login', function (req, res, next) {
  console.log('OK login post');
  passport.authenticate('local',
    function(err, User, info) {
      console.log('user='+User);
      return err 
        ? next(err)
        : User
          ? req.logIn(User, function(err) {
              console.log('err='+err);
              return err
                ? next(err)
                : res.send(JSON.stringify(User));
            })
          : res.send(false);
    }
  )(req, res, next);
});

app.get('/logout', function(req, res) {
  console.log('ok logout');
  req.logout();
  res.redirect('/');
});

app.post('/signup', function (req, res, next) {
  console.log('OK signup post');
  var user = new User({ username: req.body.email, password: req.body.password});
  console.log('user='+user);
  user.save(function(err) {
    console.log(err);
    return err
      ? next(err)
      : req.logIn(user, function(err) {        
        console.log('err='+err);
        return err
          ? next(err)
          : res.send(JSON.stringify(user));
      });
  });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
