var express = require('express');
var router = express.Router();
var Board = require('../../models/board');
var auth = require("../../auth/auth-strategy")();

router.use(auth.initialize());

router.get('/', auth.authenticate(), function (req, res, next) {
    console.log(req.user);
    console.log('OK boards get');
    Board.find({}, function(err, boards) {
        if (err) throw err;
        res.send(boards);
    });
});

router.post('/', auth.authenticate(), function (req, res, next) {
    console.log('OK boards post');
    console.log(req.user);
    var board = new Board({name: req.body.name, lists: req.body.lists?req.body.lists:[]});
    board.save(function(err) {
        if (err) throw err;
        res.status(201).send(JSON.stringify(board));
    });
});

router.delete('/:id', auth.authenticate(), function (req, res, next) {
    console.log(req.user);
    Board.findOne({ _id: req.params.id }, function(err, board) {
        if(board) {
            board.remove();
        }
    })
        res.status(201);
});

router.get('/:id', auth.authenticate(), function (req, res, next) {
    // console.log('id='+req.params.id);
    console.log(req.user);
    Board.findOne({ _id: req.params.id }, function(err, board) {
        if(board) {
            res.send(board);
        } else res.status(404);
    })
        res.status(201);
});
router.put('/:id', auth.authenticate(), function (req, res, next) {
    // console.log(req.params.id);
    console.log(req.user);
    var newBoard = new Board({name: req.body.name, lists: req.body.lists?req.body.lists:[]});            
    Board.findOne({ _id: req.params.id }, function(err, board) {
        board.name=req.body.name;
        board.lists=req.body.lists;
        board.save(function(err) {
            if (err) throw err;
        });
        res.status(201);
    }); 
});

router.get('/test', function (req, res, next) { 
    console.log('OK test get', req.body);
    res.send('OK test get');
});

module.exports = router;
