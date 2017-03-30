var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
        if (err) throw err;
        res.send(users);
    });
  // User.findOne({username: 'hhhhh'}, function(err, user) {
  //       user.remove(function(err) {});
  //   });
  //   res.send('ok');
});

module.exports = router;
