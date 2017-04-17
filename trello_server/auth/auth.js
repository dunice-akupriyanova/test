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
var crypto = require('crypto');
var jwt = require("jwt-simple");
var auth = require("./auth-strategy")();
var accessTokenExpTime = 5 * 60 * 1000;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(session({ secret: 'SECRET', resave: true, saveUninitialized: true }));

var passport = require('passport');

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        err
            ?
            done(err) :
            done(null, user);
    });
});

router.post('/token', function(req, res, next) {
    console.log('auth token post ok');
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = crypto.createHash('md5').update(req.body.password).digest('hex');
        User.findOne({ username: username }, function(err, user) {
            if (err || !user) return res.status(404).send(err);
            if (password != user.password) return res.status(401).send(err);
            var accessTokenPayload = {
                id: user._id,
                exp: Date.now() + accessTokenExpTime
            };
            var refreshTokenPayload = {
                id: user._id,
                exp: Date.now() + 7 * 24 * 60 * 60 * 1000
            };
            var accessToken = jwt.encode(accessTokenPayload, cfg.jwtSecret);
            var refreshToken = jwt.encode(refreshTokenPayload, cfg.jwtSecret);
            console.log('login=' + refreshToken);
            res.json({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        });
    } else {
        res.sendStatus(401);
    }
});

router.get("/user", auth.authenticate(), function(req, res) {
    console.log(req.user);
    if (!req.user) return res.sendStatus(401);
    res.json(req.user);
});

router.get('/logout', function(req, res) {
    console.log('ok logout auth');
    req.logout();
    res.sendStatus(200);
});

router.post('/signup', function(req, res, next) {
    console.log('OK signup post auth');
    console.log('req.body.username=', req.body);
    var hash = crypto.createHash('md5').update(req.body.password).digest('hex');
    var user = new User({ username: req.body.username, password: hash });
    console.log('user=', user);
    User.findOne({ username: req.body.username }, function(err, founduser) {
        if (err) return res.status(404).send(err);
        if (founduser) { return res.sendStatus(422); }
        user.save(function(err) {
            if (err) return res.status(422).send(err);
            var accessTokenPayload = {
                id: user._id,
                exp: Date.now() + accessTokenExpTime
            };
            var refreshTokenPayload = {
                id: user._id,
                exp: Date.now() + 7 * 24 * 60 * 60 * 1000
            };
            var accessToken = jwt.encode(accessTokenPayload, cfg.jwtSecret);
            var refreshToken = jwt.encode(refreshTokenPayload, cfg.jwtSecret);
            return req.logIn(user, function(err) {
                if (err) return res.status(401).send(err);
                return res.json({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });
            });
        });
    });
});

router.get("/refresh-token", function(req, res) {
    var refreshToken = req.headers['authorization'];
    var refreshTokenPayload = jwt.decode(refreshToken, cfg.jwtSecret);
    var accessTokenPayload = {};
    if (refreshTokenPayload.exp < Date.now()) {
        console.log('refreshTokenPayload.exp' + refreshTokenPayload.exp);
        console.log('Date.now()' + Date.now());
        res.sendStatus(401);
        return;
    }
    accessTokenPayload.id = refreshTokenPayload.id;
    accessTokenPayload.exp = Date.now() + accessTokenExpTime;
    res.json({
        accessToken: jwt.encode(accessTokenPayload, cfg.jwtSecret),
        refreshToken: jwt.encode(refreshTokenPayload, cfg.jwtSecret)
    });
});

module.exports = router;