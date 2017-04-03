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


router.get('/test'), function (req, res, next) { 
    // Board.findOne({_id:req.body.id}, function(err, board) {
    //     board.remove();
    //     res.send("ok");
    // });
        res.send("not found");
};

router.post('/rights', function(req, res, next) {
    console.log("rights");
    let userID = req.body.userID;
    let boardID = req.body.boardID;
    // Right.findOne({ userID: userID, boardID: boardID }, function(err, rights) {
    //     if (rights) {
    //         rights.remove();
    //     }
    // });
    var right = new Right({userID: userID, boardID: boardID, rights: req.body.rights});
    // console.log(right);
    // right.save(function(err) {
    //     if (err) throw err;
    // });
    Right.update({userID: userID, boardID: boardID}, {userID: userID, boardID: boardID, rights: req.body.rights}, {upsert: true}, function (err, rawResponse) {
        console.log('err:');
        console.log(err);
        console.log('rawResponse:');
        console.log(rawResponse);
        if (err) throw err;
    });
    res.send(right);
});

router.get('/rights', function (req, res, next) {
    let userID = req.query.userID;
    let boardID = req.query.boardID;
    Right.findOne({ userID: userID, boardID: boardID }, function(err, rights) {
        if(rights) {
            res.send(rights);
        } else res.send({rights: 'none'});
    })
        res.status(201);
});

router.get('/rights/:userID', function (req, res, next) {
    // console.log('id='+req.params.userID);    
    Right.find({ userID: req.params.userID }, function(err, rights) {
        if(rights) {
            res.send(rights);
        } else res.send(new Array);
    })
        res.status(201);
});
module.exports = router;
