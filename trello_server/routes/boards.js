var express = require('express');
var router = express.Router();
var Board = require('../models/board');
var auth = require("../auth/auth-strategy")();
var Right = require('../models/right');
var passport = require('passport');
var clients = require('../websockets');

router.use(passport.initialize());

router.get('/', auth.authenticate(), function(req, res, next) {
    Board.find({}, function(err, boards) {
        if (err) return res.status(404).send(err);
        res.send(boards);
    });
});

router.post('/', auth.authenticate(), function(req, res, next) {
    var board = new Board({ name: req.body.name, lists: req.body.lists ? req.body.lists : [] });
    board.save(function(err) {
        if (err) return res.status(422).send(err);
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
    Board.findOne({ _id: req.params.id }, function(err, board) {
        if (err || !board) return res.status(404).send(err);
        board.remove();
        Right.find({ boardID: req.params.id }, function(err, rights) {
            if (err) return res.status(404).send(err);
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
});
router.put('/:id', auth.authenticate(), function(req, res, next) {
    var newBoard = new Board({ name: req.body.name, lists: req.body.lists ? req.body.lists : [] });
    Board.findOne({ _id: req.params.id }, function(err, board) {
        board.name = req.body.name;
        board.lists = req.body.lists;
        board.save(function(err) {
            if (err) return res.status(422).send(err);
        });
        for (key in clients) {
            for (let client of clients[key]) {
                let response = {
                    title: 'updated',
                    payload: board
                }
                client.sendUTF(JSON.stringify(response));
            }
        }
        res.send(board);
    });
});

module.exports = router;