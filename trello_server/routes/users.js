var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Right = require('../models/right');
var Notification = require('../models/notification');
var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = require('../websockets');


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


router.get('/test'),
    function(req, res, next) {
        res.send("not found");
    };

router.post('/rights', function(req, res, next) {
    console.log("rights");
    let userID = req.body.userID;
    let boardID = req.body.boardID;
    let rights = req.body.rights;
    // console.log(rights);
    if (rights != 'none') {
        Right.update({ userID: userID, boardID: boardID }, { userID: userID, boardID: boardID, rights: rights }, { upsert: true }, function(err, rawResponse) {
            // console.log('err:');
            // console.log(err);
            // console.log('rawResponse:');
            // console.log(rawResponse);
            if (err) throw err;
            res.send({ rights: rights });
        });
    } else Right.findOne({ userID: userID, boardID: boardID }, function(err, rights) {
        if (err) throw err;
        if (!rights) { return; }
        rights.remove();
        res.sendStatus(204);
        // res.send({rights: rights});
    });
    res.status(201);
});

router.get('/rights', function(req, res, next) {
    let userID = req.query.userID;
    let boardID = req.query.boardID;
    Right.findOne({ userID: userID, boardID: boardID }, function(err, rights) {
        if (rights) {
            res.send(rights);
        } else res.send({ rights: 'none' });
    });
    res.status(201);
});

router.get('/rights/:boardID', function(req, res, next) {
    // console.log('id='+req.params.boardID);    
    Right.find({ boardID: req.params.boardID }, function(err, rights) {
        if (rights) {
            res.send(rights);
        } else res.send(new Array);
    })
    res.status(201);
});

router.post('/notification', function(req, res, next) {
    let type = req.body.type;
    let userID = req.body.userID;
    let cardID;
    if (req.body.cardID) {
        cardID = req.body.cardID;
    }
    let boardID = req.body.boardID;
    console.log('userID=', userID);
    console.log('boardID=', boardID);
    console.log('type=', type);
    Notification.findOne({ userID: userID, boardID: boardID, type: type, cardID: cardID }, function(err, notification) {
        // if (err) throw err;
        console.log('err=', err);
        if (type == 'card') {
            console.log('type is card');
            if (notification) {
                console.log('found');
                // for (let i = 0; i < notification.cards.length; i++) {
                //     if (card.id == notification.cards[i].id) {
                //         notification.cards[i].overlooked = false;
                //         notification.save(function(err) {
                //             if (err) throw err;
                //         });
                //         for (let client of clients[notification.userID]) {
                //             client.sendUTF(JSON.stringify(notification));
                //         }
                //         return;
                //     }
                // }
                // console.log('push');
                // console.log(notification.cards);
                notification.overlooked = false;
                // notification.cards.push(card);
                notification.save(function(err) {
                    if (err) throw err;
                });
                console.log('notification=', notification);
                if (clients[notification.userID]) {
                    for (let client of clients[notification.userID]) {
                        client.sendUTF(JSON.stringify(notification));
                    }
                }
                return;
            } else {
                console.log('notification not found');
                // card.overlooked = false;
                let newNotification = new Notification({ type: type, userID: userID, boardID: boardID, cardID: cardID, overlooked: false });
                newNotification.save(function(err) {
                    if (err) throw err;
                });
                console.log('newNotification=', newNotification);
                if (clients[newNotification.userID]) {
                    for (let client of clients[newNotification.userID]) {
                        client.sendUTF(JSON.stringify(newNotification));
                    }
                }
                // res.sendStatus(200);
            }
        } else {
            console.log('type is not card');
            if (notification) {
                notification.overlooked = false;
                notification.save(function(err) {
                    if (err) throw err;
                });
                for (let client of clients[notification.userID]) {
                    client.sendUTF(JSON.stringify(notification));
                }
                return;
            } else {
                console.log('new');
                let newNotification = new Notification({ type: type, userID: userID, boardID: boardID, overlooked: false });
                console.log('newNotification=', newNotification);
                newNotification.save(function(err) {
                    if (err) throw err;
                });
                console.log('clients=', clients);
                if (clients[newNotification.userID]) {
                    console.log('send');
                    for (let client of clients[newNotification.userID]) {
                        client.sendUTF(JSON.stringify(newNotification));
                    }
                }
                // res.sendStatus(200);
            }
        }
    });
});

router.get('/notification', function(req, res, next) {
    let userID = req.query.userID;
    Notification.find({ userID: userID }, function(err, notifications) {
        if (notifications) {
            console.log('notifications', notifications);
            res.send(notifications);
        } else res.send(new Array);
    });
});

router.delete('/notification', function(req, res, next) {
    let type = req.query.type;
    let cardID = req.query.cardID;
    let boardID = req.query.boardID;
    let userID = req.query.userID;
    console.log('userID=', userID);
    Notification.findOne({ type: type, boardID: boardID, userID: userID, cardID: cardID }, function(err, notification) {
        if (notification) {
            res.send(notification);
            notification.remove();
        }
    })
});

router.put('/notification', function(req, res, next) {
    let type = req.body.type;
    let cardID = req.body.cardID;
    let boardID = req.body.boardID;
    let userID = req.body.userID;
    console.log('userID=', userID);
    Notification.findOne({ type: type, boardID: boardID, userID: userID }, function(err, notification) {
        if (notification) {
            notification.overlooked = true;
            notification.save(function(err) {
                if (err) throw err;
            });
            res.send(notification);
        }
    })
});


module.exports = router;