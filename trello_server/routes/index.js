var express = require('express');
var router = express.Router();
var noteRoutes = require('./note_routes');
var User = require('../models/user');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function (req, res, next) {
  res.render('layout', { title: 'Signup' });
  console.log('signup');
});

router.post('/signup', function (req, res, next) {
  res.send('{}');
  console.log('OK_signup_post');
  console.log(req.body);
});

router.post('/test', function (req, res, next) {
  console.log('OK_test_post', req.body);

  // User.create(req.body, function (err, dbres) {
  //   if (err) {
  //     console.log(err);
  //     return res.status(400).send();
  //   }
  //   console.log('successful', dbres);
  //   res.send('respond with a resource');
  // });
  var user = new User(req.body);

  user.save((err, dbres) => {
    console.log(err, dbres);
    res.send('respond with a resource');
  });
});



// router.route('/signup')
// .all(function(req, res, next) {
//   console.log('OK_ALL');
//   next();
// })
// .post(function(req, res, next) {
//   console.log('OK_POST');
// });



module.exports = router;
// module.exports = function(app, db) {
//   noteRoutes(app, db);
//   // Тут, позже, будут и другие обработчики маршрутов 
// };