var express = require('express');
var router = express.Router();
var User = require('../models/User.js');

/* GET home page. */
router.get('/', function(req, res, next){
  if(req.session && req.session.userId){
    User.findOne({ _id: req.session.userId }).exec(function(err, userLogged){
      if(!err){
        res.render('index', { title: 'Homepage', loggedIn: 'true', fullname: userLogged.fullname });
      }
    });
  } else {
    res.render('index', { title: 'Homepage', loggedIn: 'false' });
  }
});

router.get('/login', function(req, res, next){
  if(req.session && req.session.userId){
    return res.redirect('/');
  } else {
    res.render('login', { title: 'Login' });
  }
});

router.post('/login', function(req, res, next){
  if(req.body.fullnameLG && req.body.passwordLG) {
    User.authenticate(req.body.fullnameLG, req.body.passwordLG, function (error, user) {
      if(error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }

});

router.post('/register', function(req, res, next){
  var newUser = {
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password
  };

  var user = new User(newUser);
  user.save(function(error){
    console.log(user);
    if(error) throw error;
    req.session.userId = user._id;
    return res.redirect('/');
  });
});

router.get('/logout', function(req, res, next){
  if(req.session && req.session.userId){
    req.session.destroy(function(){
      return res.redirect('/');
    });
  } else {
    return res.redirect('/');
  }
});

module.exports = router;
