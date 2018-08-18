var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require('../models/User.js');
var bc_conf = require('../server_side_blockchain_settings');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(bc_conf.node_url));
var path = require('path');
var ethAccPass = require('../ethAccPass');

/* GET home page. */
router.get('/', function(req, res, next){
  if(req.session && req.session.userId){
    User.findOne({ _id: req.session.userId }).exec(function(err, userLogged){
      if(!err){
        res.render('index', { title: 'Homepage', loggedIn: 'true', fullname: userLogged.fullname, ethAddr: userLogged.ethaddr,
	  // Movies are still hardcoded
	  producer1: "0x0033D2EE0772B9824d8C7A8E67024f1a2286341A",
	  movieName1: "Badak",
	  producer2: "0x0033D2EE0772B9824d8C7A8E67024f1a2286341A",
	  movieName2: "Mile 22",
	  producer3: "0x0033D2EE0772B9824d8C7A8E67024f1a2286341A",
	  movieName3: "Moonyoung",
	});
      }
    });
  } else {
    res.render('index', { title: 'Homepage', loggedIn: 'false',
	  // Movies are still hardcoded
	  producer1: "0x0033D2EE0772B9824d8C7A8E67024f1a2286341A",
	  movieName1: "Badak",
	  producer2: "0x0033D2EE0772B9824d8C7A8E67024f1a2286341A",
	  movieName2: "Mile 22",
	  producer3: "0x0033D2EE0772B9824d8C7A8E67024f1a2286341A",
	  movieName3: "Moonyoung",
    });
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
  if(req.body.ethAddr == "") return res.redirect('/login');
  var newUser = {
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    ethaddr: req.body.ethAddr,
  };

  var user = new User(newUser);
  user.save(function(error){
    console.log(user);
    if(error) throw error;
    req.session.userId = user._id;
    web3.eth.personal.unlockAccount(ethAccPass.mainAccAddr, ethAccPass.mainAccPass).then(function(success){
      var theContract = new web3.eth.Contract(bc_conf.contract_abi, bc_conf.contract_addr);
      theContract.methods.addUser(req.body.ethAddr, req.body.fullname).send({ 'from': ethAccPass.mainAccAddr }, function(anyError, theResponse){
        if(anyError) throw anyError;
        return res.redirect('/');
      });
    }).catch((errorProduced) => {
      console.log(errorProduced);
      throw errorProduced;
    });
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

router.get('/mov', function(req, res, next){
  if(req.session && req.session.userId){
    var theContract = new web3.eth.Contract(bc_conf.contract_abi, bc_conf.contract_addr);
    User.findOne({ _id: req.session.userId }).exec(function(err, userLogged){
      if(!err){
        var ethAddr = userLogged.ethaddr;
	theContract.methods.hasPaid(req.query.producer, ethAddr, req.query.movieName).call({}, function(error, result){
	  if(result > 0){
	    res.render('movie_player', { title: "Movie Player", producer: req.query.producer, movieName: req.query.movieName });
	  } else {
	    res.render('checkpayment', { ethAddr: ethAddr, producer: req.query.producer, movieName: req.query.movieName });
	  }
        });
      }
    });
  } else {
    return res.redirect('/');
  }
});

router.post('/payment', function(req, res, next){
  if(req.body.producer == "" || req.body.movieName == "") return res.redirect("/");
  if(req.session && req.session.userId){
    var theContract = new web3.eth.Contract(bc_conf.contract_abi, bc_conf.contract_addr);
    User.findOne({ _id: req.session.userId }).exec(function(err, userLogged){
      if(!err){
        var ethAddr = userLogged.ethaddr;
	theContract.methods.hasPaid(req.body.producer, ethAddr, req.body.movieName).call({}, function(error, result){
	  if(result > 0){
	    return res.redirect('/mov?producer=' + req.body.producer + '&movieName=' + req.body.movieName);
	  } else {
	    res.render('payment', { ethAddr: ethAddr, producer: req.body.producer, movieName: req.body.movieName, moviePrice: req.body.moviePrice });
	  }
        });
      }
    });
  } else {
    return res.redirect('/');
  }
});

router.get('/movie', function(req, res, next){
  if(req.session && req.session.userId){
    if(req.query.producer && req.query.movieName){

      const thePath = path.join(__dirname, '../movie', req.query.producer.toLowerCase() + "-" + req.query.movieName.toLowerCase() + ".mp4");
      const stat = fs.statSync(thePath);
      const fileSize = stat.size;
      const range = req.headers.range;
      if(range){
        const parts = range.replace(/bytes=/, "").split("-");
	const start = parseInt(parts[0], 10);
	const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
	const chunkSize = (end-start)+1;
	const file = fs.createReadStream(thePath, {start, end});
	var head = {
          'Content-Range': 'bytes ' + start + "-" + end + "/" + fileSize,
	  'Accept-Ranges': 'bytes',
	  'Content-Length': chunkSize,
	  'Content-Type': 'video/mp4',
	};

	res.writeHead(206, head);
	file.pipe(res);
      } else {
        const head = {
	  'Content-Length': fileSize,
	  'Content-Type': 'video/mp4',
	}
	res.writeHead(200, head);
	fs.createReadStream(thePath).pipe(res);
      }


    } else {
      return res.redirect('/');
    }
  } else {
    return res.redirect('/');
  }
});

module.exports = router;
