var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Right = require('../models/right');

router.get('/', function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) throw err;
        res.send(users);
    });
  // User.findOne({username: '333'}, function(err, user) {
  //       user.remove(function(err) {});
  //   });
  //   res.send('ok');
});

router.post('/rights', function(req, res, next) {
    console.log("rishts");
    var right = new Right({userID: req.body.userID, boardID: req.body.boardID, rights: req.body.rights});
    console.log(right);
    right.save(function(err) {
        if (err) throw err;
    });
    res.send(right);
    // res.status(201);
});

router.post('/rights/user', function (req, res, next) {
  let userID = req.body.userID;
  let boardID = req.body.boardID;
  console.log('userID='+userID);
  console.log('boardID='+boardID);
    Right.findOne({ userID: userID, boardID: boardID }, function(err, rights) {
        if(rights) {
            res.send(rights);
        } else res.send({rights: 'none'});
    })
        res.status(201);
});

module.exports = router;
