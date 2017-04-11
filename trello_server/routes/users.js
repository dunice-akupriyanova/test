var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Right = require('../models/right');
var Notification = require('../models/notification');

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
    // console.log(rights);
    if (rights!='none') {
        Right.update({userID: userID, boardID: boardID}, {userID: userID, boardID: boardID, rights: rights}, {upsert: true}, function (err, rawResponse) {
            // console.log('err:');
            // console.log(err);
            // console.log('rawResponse:');
            // console.log(rawResponse);
            if (err) throw err;
            res.send({rights: rights});
        });
    } else Right.findOne({ userID: userID, boardID: boardID }, function(err, rights) {
        if (err) throw err;
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
    });
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

router.post('/notification', function (req, res, next) {
    let username = req.body.username;
    let card = req.body.card;
    let boardID = req.body.boardID;
    console.log('username=', username);
    console.log('boardID=', boardID);
    Notification.findOne({username: username, boardID: boardID}, function (err, notification) {
            if (err) throw err;
            if (notification) {
                for (let i=0; i<notification.cards.length; i++ ) {
                    if (card.id==notification.cards[i].id) {
                        console.log('found');
                        res.send(notification);
                        return;
                    }
                }
                console.log('push');
                console.log(notification.cards);
                notification.cards.push(card);
                notification.save(function(err) {
                    if (err) throw err;
                });
                res.send(notification);
                return;
            } else {
                console.log('notification not found');
                let newNotification = new Notification({username: username, boardID: boardID, cards: [card]});
                 newNotification.save(function(err) {
                    if (err) throw err;
                });
                res.send(newNotification);
            }                        
        });
 });

router.get('/notification', function (req, res, next){
    let username = req.query.username;
    Notification.find({ username: username }, function(err, notifications) {
        if(notifications) {
            res.send(notifications);
        } else res.send(new Array);
    });
});

router.delete('/notification', function (req, res, next){
    let cardID = req.query.cardID;
    let boardID = req.query.boardID;
    let username = req.query.username;
    console.log('username=', username);
    Notification.findOne({ boardID: boardID, username: username }, function(err, notification) {
        if(notification) {
            console.log('found=', notification);
           for (let i=0; i<notification.cards.length; i++) {
                if (notification.cards[i].id==cardID) {
                    res.send(notification.cards[i]);
                    console.log('before');
                    console.log(notification.cards);
                    notification.cards[i].remove();
                    console.log('after');
                    console.log(notification.cards);
                    if (!notification.cards.length) {
                        notification.remove();
                    } else {
                        notification.save(function(err) {
                            if (err) throw err;
                        });
                    }
                    return;
                }
           }
        }
    })
});

module.exports = router;
