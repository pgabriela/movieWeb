var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var User = require('../models/User.js');
var Prod = require('../models/Prod.js');
var Admin = require('../models/Admin.js');
var bc_conf = require('../server_side_blockchain_settings');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(bc_conf.node_url));
var path = require('path');
var ethAccPass = require('../ethAccPass');
var movieDB = require('../models/movie');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session && req.session.adminId) {
        Admin.findOne({
            _id: req.session.adminId
        }).exec(function(err, adminLogged){
            if(!err){
                res.render('index', {
                    title: 'Homepage',
                    loggedIn: 'true',
                    fullname: adminLogged.username,
                    ethAddr: "",
                    isProd: 'false',
                    isAdmin: 'true',
                    // Movies are still hardcoded
                    producer1: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
                    movieName1: "Badak",
                    producer2: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
                    movieName2: "Mile 22",
                    producer3: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
                    movieName3: "Moonyoung",
                });
            }
        });
    } else if (req.session && req.session.userId) {
        User.findOne({
            _id: req.session.userId
        }).exec(function(err, userLogged) {
            if (!err) {
                Prod.findOne({
                    ethaddr: userLogged.ethaddr.toLowerCase()
                }, function(err2, prodLogged){
                    if(!err2){
                        if(prodLogged){
                            req.session.prodId = prodLogged._id;
                            res.render('index', {
                                title: 'Homepage',
                                loggedIn: 'true',
                                fullname: userLogged.fullname,
                                ethAddr: userLogged.ethaddr.toLowerCase(),
                                isProd: 'true',
                                isAdmin: 'false',
                                // Movies are still hardcoded
                                producer1: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
                                movieName1: "Badak",
                                producer2: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
                                movieName2: "Mile 22",
                                producer3: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
                                movieName3: "Moonyoung",
                            });
                        } else {
                            res.render('index', {
                                title: 'Homepage',
                                loggedIn: 'true',
                                fullname: userLogged.fullname,
                                ethAddr: userLogged.ethaddr.toLowerCase(),
                                isProd: 'false',
                                isAdmin: 'false',
                                // Movies are still hardcoded
                                producer1: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
                                movieName1: "Badak",
                                producer2: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
                                movieName2: "Mile 22",
                                producer3: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
                                movieName3: "Moonyoung",
                            });
                        }
                    }
                });
            }
        });
    } else {
        res.render('index', {
            title: 'Homepage',
            loggedIn: 'false',
            isProd: 'false',
            isAdmin: 'false',
            // Movies are still hardcoded
            producer1: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
            movieName1: "Badak",
            producer2: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
            movieName2: "Mile 22",
            producer3: "0x36A696291B5FF6a2Ae57c45E9bf1e6A2981fA357",
            movieName3: "Moonyoung",
        });
    }
});

router.get('/login', function(req, res, next) {
    if (req.session && (req.session.userId || req.session.adminId)) {
        return res.redirect('/');
    } else {
        res.render('login', {
            title: 'Login'
        });
    }
});

router.post('/login', function(req, res, next) {
    if (req.body.fullnameLG && req.body.passwordLG) {
        Admin.authenticate(req.body.fullnameLG, req.body.passwordLG, function(err, adm){
            if(err || !adm){
                User.authenticate(req.body.fullnameLG, req.body.passwordLG, function(error, user) {
                    if (error || !user) {
                        var err = new Error('Wrong email or password.');
                        err.status = 401;
                        return next(err);
                    } else {
                        req.session.userId = user._id;
                        Prod.findOne({
                            ethaddr: user.ethaddr.toLowerCase()
                        }, function(err2, result){
                            if(err2) throw err2;
                            if(result) req.session.prodId = result._id;
                            return res.redirect('/');
                        });
                    }
                });
            } else {
                req.session.adminId = adm._id;
                return res.redirect('/');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

router.post('/register', function(req, res, next) {
    if (req.body.ethAddr == "") return res.redirect('/login');
    var newUser = {
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        ethaddr: req.body.ethAddr.toLowerCase(),
    };

    var user = new User(newUser);
    user.save(function(error) {
        console.log(user);
        if (error) throw error;
        req.session.userId = user._id;
        web3.eth.personal.unlockAccount(ethAccPass.mainAccAddr, ethAccPass.mainAccPass).then(function(success) {
            var theContract = new web3.eth.Contract(bc_conf.contract_abi, bc_conf.contract_addr);
            theContract.methods.addUser(req.body.ethAddr, req.body.fullname).send({
                'from': ethAccPass.mainAccAddr
            }, function(anyError, theResponse) {
                if (anyError) throw anyError;
                return res.redirect('/');
            });
        }).catch((errorProduced) => {
            console.log(errorProduced);
            throw errorProduced;
        });
    });
});

router.get('/logout', function(req, res, next) {
    if (req.session && (req.session.userId || req.session.adminId)) {
        req.session.destroy(function() {
            return res.redirect('/');
        });
    } else {
        return res.redirect('/');
    }
});

router.get('/mov', function(req, res, next) {
    if (req.session && req.session.userId) {
        var theContract = new web3.eth.Contract(bc_conf.contract_abi, bc_conf.contract_addr);
        User.findOne({
            _id: req.session.userId
        }).exec(function(err, userLogged) {
            if (!err) {
                var ethAddr = userLogged.ethaddr;
                theContract.methods.hasPaid(req.query.producer, ethAddr, req.query.movieName).call({}, function(error, result) {
                    if (result > 0) {
                        if(req.session.hasPaid){
                            req.session.hasPaid.push(req.query.producer.toLowerCase() + '-' + req.query.movieName.toLowerCase());
                        } else {
                            req.session.hasPaid = [];
                            req.session.hasPaid.push(req.query.producer.toLowerCase() + '-' + req.query.movieName.toLowerCase());
                        }
                        res.render('movie_player', {
                            title: "Movie Player",
                            producer: req.query.producer.toLowerCase(),
                            movieName: req.query.movieName
                        });
                    } else {
                        res.render('checkpayment', {
                            ethAddr: ethAddr,
                            producer: req.query.producer.toLowerCase(),
                            movieName: req.query.movieName
                        });
                    }
                });
            }
        });
    } else {
        return res.redirect('/');
    }
});

router.post('/payment', function(req, res, next) {
    if (req.body.producer == "" || req.body.movieName == "") return res.redirect("/");
    if (req.session && req.session.userId) {
        var theContract = new web3.eth.Contract(bc_conf.contract_abi, bc_conf.contract_addr);
        User.findOne({
            _id: req.session.userId
        }).exec(function(err, userLogged) {
            if (!err) {
                var ethAddr = userLogged.ethaddr;
                theContract.methods.hasPaid(req.body.producer, ethAddr, req.body.movieName).call({}, function(error, result) {
                    if (result > 0) {
                        return res.redirect('/mov?producer=' + req.body.producer + '&movieName=' + req.body.movieName);
                    } else {
                        res.render('payment', {
                            ethAddr: ethAddr,
                            producer: req.body.producer,
                            movieName: req.body.movieName,
                            moviePrice: req.body.moviePrice
                        });
                    }
                });
            }
        });
    } else {
        return res.redirect('/');
    }
});

router.get('/movie', function(req, res, next) {
    if (req.session && req.session.userId) {
        if (req.query.producer && req.query.movieName) {
            var sess = req.query.producer.toLowerCase() + '-' + req.query.movieName.toLowerCase();
            if(req.session.hasPaid && req.session.hasPaid.indexOf(sess) >= 0){
                const thePath = path.join(__dirname, '../movie', req.query.producer.toLowerCase() + "-" + req.query.movieName.toLowerCase() + ".mp4");
                const stat = fs.statSync(thePath);
                const fileSize = stat.size;
                const range = req.headers.range;
                if (range) {
                    const parts = range.replace(/bytes=/, "").split("-");
                    const start = parseInt(parts[0], 10);
                    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                    const chunkSize = (end - start) + 1;
                    const file = fs.createReadStream(thePath, {
                        start,
                        end
                    });
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
    } else {
        return res.redirect('/');
    }
});

router.get('/upload', function(req, res, next){
    if (req.session && req.session.userId && req.session.prodId) {
        Prod.findOne({
            _id: req.session.prodId
        }).exec(function(err, prodLogged) {
            if (!err) {
                res.render('movie_upload', {
                    ethAddr: prodLogged.ethaddr.toLowerCase(),
                });
            }
        });
    } else {
        return res.redirect('/');
    }
});

router.post('/upload', function(req, res) {
    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = false;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/../uploads');

    // parse the incoming request containing the form data
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log("An error has occured: \n" + err);
            throw err;
        }
        var newMovie = {
            title: fields.MovieTitle.toLowerCase(),
            genre: fields.MovieGenre,
            releasedate: fields.MovieReleaseDate,
            cast: fields.MovieCast,
            country: fields.MovieCountry,
            price: fields.MoviePrice,
            description: fields.MovieDescription,
            prodAddr: fields.ethAddr.toLowerCase()
        };

        var newNewMovie = new movieDB(newMovie);
        newNewMovie.save(function(error) {
            console.log(newNewMovie);
            if (error) throw error;
            fs.rename(files.upload.path, path.join(form.uploadDir, fields.ethAddr.toLowerCase() + '-' + fields.MovieTitle.toLowerCase() + '.mp4'));
            res.end('success');
        });
    });
});

router.get('/tokenstore', function(req, res, next){
    if(!req.session || !req.session.userId) return res.redirect('/');
    User.findOne({
        _id: req.session.userId
    }, function(err, userLogged){
        if(err) throw err;
        res.render('tokenStore', { ethAddr: userLogged.ethaddr });
    });
});

router.get('/admin', function(req, res, next){
    if(req.session && req.session.adminId){
        res.render('admin', {
            errMsg: "",
            resultMsg: ""
        });
    } else {
        return res.redirect('/');
    }
});

router.post('/admin', function(req, res, next){
    if(req.session && req.session.adminId){
        var option = req.body.option;
        if(option == 'addProducer'){
            User.findOne({
                ethaddr: req.body.prodAddr.toLowerCase()
            }).exec(function(er, user){
                if(er || !user){
                    res.render('admin', {
                        errMsg: 'Cannot find user with that ethereum address',
                        resultMsg: "",
                    });
                } else {
                    var newProd = {
                        ethaddr: req.body.prodAddr.toLowerCase()
                    };
                    var prod = new Prod(newProd);
                    prod.save(function(err){
                        if (err) throw err;
                        web3.eth.personal.unlockAccount(ethAccPass.mainAccAddr, ethAccPass.mainAccPass).then(function(success) {
                            var theContract = new web3.eth.Contract(bc_conf.contract_abi, bc_conf.contract_addr);
                            theContract.methods.addProducer(prod.ethaddr, user.fullname).send({
                                'from': ethAccPass.mainAccAddr
                            }, function(anyError, theResponse) {
                                if (anyError) throw anyError;
                                res.render('admin', {
                                    errMsg: "",
                                    resultMsg: prod.ethaddr + " has successfully been added to producer list"
                                });
                            });
                        }).catch((errorProduced) => {
                            console.log(errorProduced);
                            throw errorProduced;
                        });
                    });
                }
            });
        } else if (option == 'addMovie'){
            var movieAddr = req.body.movieAddr.toLowerCase();
            var movieTitle = req.body.movieTitle;
            movieDB.findOne({
                prodAddr: movieAddr,
                title: movieTitle.toLowerCase()
            }).exec(function(err10, res10){
                if(!err10 && res10){
                    web3.eth.personal.unlockAccount(ethAccPass.mainAccAddr, ethAccPass.mainAccPass).then(function(success) {
                        var theContract = new web3.eth.Contract(bc_conf.contract_abi, bc_conf.contract_addr);
                        theContract.methods.addMovie(movieAddr, toTitleCase(movieTitle), res10.releasedate, res10.genre, res10.cast, res10.description, res10.country, res10.price).send({
                            'from': ethAccPass.mainAccAddr
                        }, function(anyError, theResponse) {
                            if (anyError) throw anyError;
                            movieDB.deleteOne({
                                prodAddr: movieAddr,
                                title: movieTitle.toLowerCase()
                            }, function(deleteErr){
                                if(!deleteErr){
                                    var currPath = path.join(__dirname, '/../uploads');
                                    var newPath = path.join(__dirname, '/../movie');
                                    fs.rename(path.join(currPath, movieAddr + '-' + movieTitle.toLowerCase() + '.mp4'),
                                        path.join(newPath, movieAddr + '-' + movieTitle.toLowerCase() + '.mp4'));
                                    res.render('admin', {
                                        errMsg: "",
                                        resultMsg: "That movie has successfully been added to movie list"
                                    });
                                }
                            });
                        });
                    }).catch((errorProduced) => {
                        console.log(errorProduced);
                        throw errorProduced;
                    });
                } else {
                    res.render('admin', {
                        errMsg: "Movie not found",
                        resultMsg: ""
                    });
                }
            })
        }
    } else {
        return res.redirect('/');
    }
});

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

module.exports = router;
