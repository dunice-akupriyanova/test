var express = require('express');
var router = express.Router();
var User = require('../models/user');


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('index, wth!');
  res.render('index', { title: 'Express' });
});

router.get('/signup', function (req, res, next) {
  res.render('layout', { title: 'Signup' });
  console.log('signup');
});

router.post('/test', function (req, res, next) {
  console.log('OK test post', req.body);

  var user = new User(req.body);

  user.save((err, dbres) => {
    console.log(err, dbres);
    res.send('Ok');
  });
});


module.exports = router;
