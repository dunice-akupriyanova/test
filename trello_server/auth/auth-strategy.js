var passport = require("passport");
var passportJWT = require("passport-jwt");
var User = require('../models/user');
var cfg = require("../config/config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
    var strategy = new Strategy(params, function(payload, done) {
        if (payload.exp < Date.now()) {
            return done(new Error("Expiry time is over"), null);
        }
        User.findOne({ _id: payload.id }, function(err, user) {
            if (!user || err) return done(new Error("User not found"), null);
            return done(null, {
                id: user._id,
                username: user.username
            });
        });
    });
    passport.use(strategy);
    return {
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};