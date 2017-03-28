var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var User = require('../models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var app = express();
var session = require('express-session');
var cfg = require('../config/config');  
var jwt = require("jwt-simple"); 
var auth = require("./auth")();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

var passport = require('passport');
var LocalStrategy  = require('passport-local').Strategy;

router.use(auth.initialize());
router.use(passport.session());

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

router.get('/token', function(req, res, next) {
    console.log('auth token ok');
    res.send('auth token OK');
});

router.post('/token', function(req, res, next) {
    console.log('auth token post ok');
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = req.body.password;
        User.findOne({ username : username},function(err,user){
          if (err) return next(err);
          if (!user) return res.send(false);
          if (password != user.password) return res.send(false);
          var accessTokenPayload = {
              id: user._id,
              exp: Date.now()+10*60*1000
          };
          var refreshTokenPayload = {
              id: user._id,
              exp: Date.now()+7*24*60*60*1000
          };
          var accessToken = jwt.encode(accessTokenPayload, cfg.jwtSecret);
          var refreshToken = jwt.encode(refreshTokenPayload, cfg.jwtSecret);
          res.json({
              accessToken: accessToken,
              refreshToken: refreshToken
          });
        });
    } else {
        res.sendStatus(401);
    }
});


router.get('/', function(req, res, next) {
    console.log('auth ok');
    res.send('auth OK');
});

router.get('/test', function (req, res, next) {
  res.send('OK, test');
  console.log('test OK');
});

router.get("/user", auth.authenticate(), function(req, res) {  
    res.json(req.user);
});

router.get('/logout', function(req, res) {
  console.log('ok logout auth');
  req.logout();
});

router.post('/signup', function (req, res, next) {
  console.log('OK signup post auth');
  var user = new User({ username: req.body.username, password: req.body.password});
  console.log('auth user='+user);
  user.save(function(err) {
    console.log(err);
    return err
      ? next(err)
      : req.logIn(user, function(err) {        
        console.log('auth err='+err);
        return err
          ? next(err)
          : res.send(JSON.stringify(user));
      });
  });
});

module.exports = router;