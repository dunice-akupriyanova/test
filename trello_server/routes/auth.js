var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var User = require('../models/user');
var app = express();
var session = require('express-session');
var cfg = require('../config/config');
var crypto = require('crypto');
var jwt = require("jwt-simple");
var auth = require("../auth/auth-strategy")();
var accessTokenExpTime = 15 * 1000;

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
    if (!req.body.username || !req.body.password) return res.sendStatus(401);
    var username = req.body.username;
    var password = crypto.createHash('md5').update(req.body.password).digest('hex');
    User.findOne({ username: username }, function(err, user) {
        if (err || !user) return res.status(404).send(err);
        if (password != user.password) return res.sendStatus(401);
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
        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    });
});

router.get("/user", auth.authenticate(), function(req, res) {
    if (!req.user) return res.sendStatus(401);
    res.json(req.user);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.sendStatus(200);
});

router.post('/signup', function(req, res, next) {
    var hash = crypto.createHash('md5').update(req.body.password).digest('hex');
    var user = new User({ username: req.body.username, password: hash });
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
    console.log('refreshToken=', refreshToken);
    var refreshTokenPayload = jwt.decode(refreshToken, cfg.jwtSecret);
    var accessTokenPayload = {};
    if (refreshTokenPayload.exp < Date.now()) {
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