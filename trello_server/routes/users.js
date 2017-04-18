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
        if (err) return res.status(404).send(err);
        res.send(users);
    });
});

router.post('/rights', function(req, res, next) {
    let userID = req.body.userID;
    let boardID = req.body.boardID;
    let rights = req.body.rights;
    if (rights != 'none') {
        Right.update({ userID: userID, boardID: boardID }, { userID: userID, boardID: boardID, rights: rights }, { upsert: true }, function(err, rawResponse) {
            if (err) return res.status(422).send(err);
            res.send({ rights: rights });
        });
    } else {
        Right.findOne({ userID: userID, boardID: boardID }, function(err, rights) {
            if (err || !rights) return res.status(404).send(err);
            rights.remove();
            res.sendStatus(204);
        });
    }
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

router.post('/notification', function(req, res, next) {
    let type = req.body.type;
    let userID = req.body.userID;
    let cardID;
    if (req.body.cardID) {
        cardID = req.body.cardID;
    }
    let boardID = req.body.boardID;
    Notification.findOne({ userID: userID, boardID: boardID, type: type, cardID: cardID }, function(err, notification) {
        if (err) return res.status(404).send(err);
        if (notification) {
            notification.overlooked = false;
            notification.save(function(err) {
                if (err) return res.status(422).send(err);
            });
            if (!clients[notification.userID]) return;
            for (let client of clients[notification.userID]) {
                client.sendUTF(JSON.stringify(notification));
            }
        } else {
            let newNotification = new Notification({ type: type, userID: userID, boardID: boardID, cardID: cardID, overlooked: false });
            newNotification.save(function(err) {
                if (err) return res.status(422).send(err);
            });
            if (!clients[newNotification.userID]) return;
            for (let client of clients[newNotification.userID]) {
                client.sendUTF(JSON.stringify(newNotification));
            }
        }
    });
});

router.get('/notification', function(req, res, next) {
    let userID = req.query.userID;
    Notification.find({ userID: userID }, function(err, notifications) {
        if (err) return res.sendStatus(404);
        if (notifications) {
            res.send(notifications);
        } else res.send(new Array);
    });
});

router.delete('/notification', function(req, res, next) {
    let type = req.query.type;
    let cardID = req.query.cardID;
    let boardID = req.query.boardID;
    let userID = req.query.userID;
    if (type == 'card') {
        Notification.findOne({ type: type, boardID: boardID, userID: userID, cardID: cardID }, function(err, notification) {
            console.log('notification=', notification);
            if (err || !notification) return res.status(404).send(err);
            res.send(notification);
            notification.remove();
        });
        return;
    }
    Notification.findOne({ type: type, boardID: boardID, userID: userID }, function(err, notification) {
        console.log('notification=', notification);
        if (err || !notification) return res.status(404).send(err);
        res.send(notification);
        notification.remove();
    });
});

router.put('/notification', function(req, res, next) {
    let type = req.body.type;
    let cardID = req.body.cardID;
    let boardID = req.body.boardID;
    let userID = req.body.userID;
    Notification.findOne({ type: type, boardID: boardID, userID: userID, cardID: cardID }, function(err, notification) {
        if (err || !notification) return res.status(404).send(err);
        notification.overlooked = true;
        notification.save(function(err) {
            if (err) return res.status(422).send(err);
            res.send(notification);
        });
    })
});

module.exports = router;