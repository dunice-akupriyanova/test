var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var User = require('../models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var app = express();
var session = require('express-session');


var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secret';
// opts.usernameField='email';
// opts.passwordField='password';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));


var passport = require('passport');
var LocalStrategy  = require('passport-local').Strategy;

router.use(passport.initialize());
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

// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//     User.findOne({_id: jwt_payload.sub}, function(err, user) {
//         console.log(err);
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//         }
//     });
// }));

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

router.get('/', function(req, res, next) {
    console.log('auth ok');
    res.send('auth OK');
});

router.get('/test', function (req, res, next) {
  res.send('OK, test');
  console.log('test OK');
});

router.post('/login', function (req, res, next) {
  console.log('OK login post auth');
  passport.authenticate('local',
    function(err, User, info) {
      console.log('auth user='+User);
      return err 
        ? next(err)
        : User
          ? req.logIn(User, function(err) {
              console.log('auth err='+err);
              return err
                ? next(err)
                : res.send(JSON.stringify(User));
            })
          : res.send(false);
    }
  )(req, res, next);
});

router.get('/logout', function(req, res) {
  console.log('ok logout auth');
  req.logout();
//   res.redirect('/');
});

router.post('/signup', function (req, res, next) {
  console.log('OK signup post auth');
  var user = new User({ username: req.body.email, password: req.body.password});
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