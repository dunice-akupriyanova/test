var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Link = require('../models/link');
var session = require('express-session');
var cfg = require('../config/config');
var crypto = require('crypto');
var jwt = require("jwt-simple");
var auth = require("../auth/auth-strategy")();
var transporter = require('../libs/transporter')();
const nodemailer = require('nodemailer');
var accessTokenExpTime = 5 * 60 * 1000;

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

router.post('/reset-password', function(req, res, next) {
    var token = req.body.token;
    Link.findOne({ token: token }, function(err, link) {
        token = jwt.decode(token, cfg.jwtSecret);
        if (err || !link) return res.status(404).send(err);
        userID = token.id;
        if (token.exp < Date.now()) {
            return res.status(401).send('');
        }
        User.findOne({ _id: userID }, function(err, user) {
            if (err || !user) return res.status(404).send(err);
            var newPassword = crypto.createHash('md5').update(req.body.newPassword).digest('hex');
            user.password = newPassword;
            user.save(function(err) {
                if (err) return res.status(422).send(err);
                res.send({});
            });
        });
        link.remove();
    });
});

router.post('/forgot-password', function(req, res, next) {
    var username = req.body.login;
    User.findOne({ username: username }, function(err, user) {
        if (err || !user) return res.status(404).send(err);
        var token = {
            exp: Date.now() + 1000 * 60 * 60,
            id: user._id
        };
        var token = jwt.encode(token, cfg.jwtSecret);
        let newLink = new Link({ userID: user._id, token: token });
        Link.findOne({ userID: user._id }, function(err, link) {
            if (err || !link) return console.log(err);
            link.remove();
        });
        let saveLink = new Promise(function(resolve, reject) {
            newLink.save(function(err, link) {
                if (err) return reject(err);
                resolve(link);
            });
        });
        saveLink.then(
            response => {
                let link = `http://localhost:4200/reset/${token}`;
                let mailOptions = {
                    from: '"no reply" <trello.server@mail.ru>',
                    to: user.username,
                    subject: `Forgot password for ${user.username}`,
                    text: `Dear ${user.username}! Click here to reset your password: ${link}`,
                };
                transporter.sendMail(mailOptions).then(
                    response => {
                        res.send(true);
                        console.log('Message %s sent: %s', response.messageId, response.response);
                    },
                    error => {
                        res.send(false);
                        console.log(error);
                    }
                );
            },
            error => {
                res.status(422).send(err);
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