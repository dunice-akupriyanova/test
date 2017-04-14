var express = require('express');
var router = express.Router();
var Board = require('../models/board');
var auth = require("../auth/auth-strategy")();
var Right = require('../models/right');
var passport = require('passport');
var clients = require('../websockets');

router.use(passport.initialize());

router.get('/', auth.authenticate(), function(req, res, next) {
    console.log(req.user);
    console.log('OK boards get');
    Board.find({}, function(err, boards) {
        if (err) throw err;
        res.send(boards);
    });
});

router.post('/', auth.authenticate(), function(req, res, next) {
    console.log('OK boards post');
    console.log(req.user);
    var board = new Board({ name: req.body.name, lists: req.body.lists ? req.body.lists : [] });
    console.log('board=', board);
    board.save(function(err) {
        if (err) throw err;
        for (key in clients) {
            for (let client of clients[key]) {
                let response = {
                    title: 'boardsAreUpdated'
                }
                client.sendUTF(JSON.stringify(response));
            }
        }
        res.status(201).send(JSON.stringify(board));
    });
});

router.delete('/:id', auth.authenticate(), function(req, res, next) {
    console.log('delete');
    console.log(req.user);
    Board.findOne({ _id: req.params.id }, function(err, board) {
        if (!board) { return; }
        board.remove();
        Right.find({ boardID: req.params.id }, function(err, rights) {
            if (err) throw err;
            for (let i = 0; i < rights.length; i++) {
                rights[i].remove();
            }
        });
        for (key in clients) {
            for (let client of clients[key]) {
                let response = {
                    title: 'boardsAreUpdated',
                }
                client.sendUTF(JSON.stringify(response));
            }
        }
    })
    res.status(201);
});

router.get('/:id', auth.authenticate(), function(req, res, next) {
    // console.log('id='+req.params.id);
    console.log(req.user);
    Board.findOne({ _id: req.params.id }, function(err, board) {
        if (board) {
            res.send(board);
        } else res.status(404);
    })
    res.status(201);
});
router.put('/:id', auth.authenticate(), function(req, res, next) {
    // console.log(req.params.id);
    console.log('req.user=', req.user);
    // console.log('clients=', clients);
    var newBoard = new Board({ name: req.body.name, lists: req.body.lists ? req.body.lists : [] });
    Board.findOne({ _id: req.params.id }, function(err, board) {
        board.name = req.body.name;
        board.lists = req.body.lists;
        board.save(function(err) {
            if (err) console.log(err);
            if (err) throw err;
        });
        for (key in clients) {
            console.log('key=', key);
            // if (key!=req.user.id) {
            for (let client of clients[key]) {
                let response = {
                    title: 'updated',
                    payload: board
                }
                client.sendUTF(JSON.stringify(response));
            }
            // }
        }
        res.send(board);
    });
});

router.get('/test', function(req, res, next) {
    console.log('OK test get', req.body);
    res.send('OK test get');
});


module.exports = router;