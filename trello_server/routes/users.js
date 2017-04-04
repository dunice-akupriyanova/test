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
        res.send("not found");
};

router.post('/rights', function(req, res, next) {
    console.log("rights");
    let userID = req.body.userID;
    let boardID = req.body.boardID;
    let rights = req.body.rights;
    console.log(rights);
    if (rights!='none') {
        Right.update({userID: userID, boardID: boardID}, {userID: userID, boardID: boardID, rights: rights}, {upsert: true}, function (err, rawResponse) {
            console.log('err:');
            console.log(err);
            console.log('rawResponse:');
            console.log(rawResponse);
            if (err) throw err;
            res.send({rights: rights});
        });
    } else Right.findOne({ userID: userID, boardID: boardID }, function(err, rights) {
        if(rights) {
            rights.remove();
            res.sendStatus(204);
            // res.send({rights: rights});
        }
     } );
    res.status(201);
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

router.get('/rights/:boardID', function (req, res, next) {
    // console.log('id='+req.params.boardID);    
    Right.find({ boardID: req.params.boardID }, function(err, rights) {
        if(rights) {
            res.send(rights);
        } else res.send(new Array);
    })
        res.status(201);
});
module.exports = router;
