var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Right = require('../models/right');
var Notification = require('../models/notification');
var WebSocketServer = require('websocket').server;
var http = require('http');

// var server = http.createServer(function(request, response) {
//     // process HTTP request. Since we're writing just WebSockets server
//     // we don't have to implement anything.
// });
// server.listen(8080, function() { });

// wsServer = new WebSocketServer({
//     httpServer: server
// });

var clients = require('../websockets');
// var clients = [];


// wsServer.on('request', function(request) {
//     var connection = request.accept(null, request.origin);
//     clients.push(connection);
//     // connection.sendUTF(JSON.stringify('123'));
//     // This is the most important callback for us, we'll handle
//     // all messages from users here.
//     connection.on('message', function(message) {
//         if (message.type === 'utf8') {
//             // process WebSocket message
//         }
//         console.log(message);
//     });

//     connection.on('close', function(connection) {
//         // close user connection
//     });
// });


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
    let type = req.body.type;
    let username = req.body.username;
    let card;
    if (req.body.card) {
        card = req.body.card;
    }
    let boardID = req.body.boardID;
    console.log('username=', username);
    console.log('boardID=', boardID);
    Notification.findOne({username: username, boardID: boardID, type: type}, function (err, notification) {
            if (err) throw err;
            if (type=='card') {
                if (notification) {
                    for (let i=0; i<notification.cards.length; i++ ) {
                        if (card.id==notification.cards[i].id) {
                            console.log('found');
                            for (let c of clients) {
                                c.sendUTF(JSON.stringify(notification));
                            }
                            return;
                        }
                    }
                    console.log('push');
                    // console.log(notification.cards);
                    notification.cards.push(card);
                    notification.save(function(err) {
                        if (err) throw err;
                    });
                    for (let c of clients) {
                        c.sendUTF(JSON.stringify(notification));
                    }
                    return;
                } else {
                    console.log('notification not found');
                    let newNotification = new Notification({type: type, username: username, boardID: boardID, cards: [card]});
                    newNotification.save(function(err) {
                        if (err) throw err;
                    });
                    for (let c of clients) {
                        c.sendUTF(JSON.stringify(newNotification));
                    }
                    // res.sendStatus(200);
                }
            } else {
                if (notification) {
                    for (let c of clients) {
                        c.sendUTF(JSON.stringify(notification));
                    }
                    return;
                } else {
                    console.log('new');
                    let newNotification = new Notification({type: type, username: username, boardID: boardID});
                    console.log('newNotification=', newNotification);
                    newNotification.save(function(err) {
                        if (err) throw err;
                    });
                    for (let c of clients) {
                        c.sendUTF(JSON.stringify(newNotification));
                    }
                    // res.sendStaнtus(200);
                }
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
    let type = req.query.type;
    let cardID = req.query.cardID;
    let boardID = req.query.boardID;
    let username = req.query.username;
    console.log('username=', username);
    Notification.findOne({ type: type, boardID: boardID, username: username }, function(err, notification) {
        if (type=='card') {
            if(notification) {
                // console.log('found=', notification);
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
        } else {
            if(notification) {
                res.send(notification);
                notification.remove();
            }
        }
    })
});

module.exports = router;
