var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secret';
// opts.usernameField='email';
// opts.passwordField='password';

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

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload.sub}, function(err, user) {
        console.log(err);
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));




// var LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password'
// }, function(username, password, done){
//   User.findOne({ username : username},function(err,user){
//     return err 
//       ? done(err)
//       : user
//         ? password === user.password
//           ? done(null, user)
//           : done(null, false, { message: 'Incorrect password.' })
//         : done(null, false, { message: 'Incorrect username.' });
//   });
// }));


module.exports = passport;