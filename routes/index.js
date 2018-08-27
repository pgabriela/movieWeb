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
var MoviesSaved = require('../models/MovieSaved');

/* GET home page. */
router.get('/', function(req, res, next) {
    var theContract = new web3.eth.Contract(bc_conf.contract_abi, bc_conf.contract_addr);
    MoviesSaved.find({}, function(eMS, rMS){
        if(rMS.length == 0){
            if(req.session && req.session.adminId){
		res.render('index', {
		    title: 'Homepage',
		    loggedIn: 'true',
		    fullname: "admin",
		    ethAddr: "",
		    isProd: 'false',
		    isAdmin: 'true',
		    producer1: "",
		    movieName1: "",
		    movieName1Lower: "",
		    movieCountry1: "",
		    producer2: "",
		    movieName2: "",
		    movieName2Lower: "",
		    movieCountry2: '',
		    producer3: "",
		    movieName3: "",
		    movieName3Lower: "",
		    movieCountry3: "",
		    mostReviewed: [],
		    topRated: [] 
	        });
            } else if(req.session && req.session.userId){ 
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
					producer1: "",
					movieName1: "",
					movieName1Lower: "",
					movieCountry1: "",
					producer2: "",
					movieName2: "",
					movieName2Lower: "",
					movieCountry2: "",
					producer3: "",
					movieName3: "",
					movieName3Lower: "",
					movieCountry3: "",
					mostReviewed: [],
					topRated: [] 
				    });
				} else {
				    res.render('index', {
					title: 'Homepage',
					loggedIn: 'true',
					fullname: userLogged.fullname,
					ethAddr: userLogged.ethaddr.toLowerCase(),
					isProd: 'false',
					isAdmin: 'false',
					producer1: "",
					movieName1: "",
					movieName1Lower: "",
					movieCountry1: "",
					producer2: "",
					movieName2: "",
					movieName2Lower: "",
					movieCountry2: "",
					producer3: "",
					movieName3: "",
					movieName3Lower: "",
					movieCountry3: "",
					mostReviewed: [],
					topRated: []
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
		    producer1: "",
		    movieName1: "",
		    movieName1Lower: "",
		    movieCountry1: "",
		    producer2: "",
		    movieName2: "",
		    movieName2Lower: "",
		    movieCountry2: "",
		    producer3: "",
		    movieName3: "",
		    movieName3Lower: "",
		    movieCountry3: "",
		    mostReviewed: [],
		    topRated: []
		});
	    }
        } else {
            var mostReviewed = [];
            var topRated = [];
            var mostReviewedSorted = [];
            var topRatedSorted = [];
            for(let movieInDB in rMS){
                mostReviewed.push(new Promise(function(resolve, reject){
                    theContract.methods.getMovieReviewCount(rMS[movieInDB].prodAddr, toTitleCase(rMS[movieInDB].title)).call({}, function(eRC, rRC){
                        resolve([movieInDB, parseInt(rRC)]);
                    });
                }));
            }
            for(let movieInDB2 in rMS){
                topRated.push(new Promise(function(resolve, reject){
                    theContract.methods.getMovieRatingSum(rMS[movieInDB2].prodAddr, toTitleCase(rMS[movieInDB2].title)).call({}, function(eRS, rRS){
                        theContract.methods.getMovieRaterSum(rMS[movieInDB2].prodAddr, toTitleCase(rMS[movieInDB2].title)).call({}, function(eRrS, rRrS){
                            resolve([movieInDB2, rRrS == 0 ? 0 : rRS / rRrS]);
                        });
                    });
                }));
            }
            Promise.all(mostReviewed).then(function(mostReviewedDone){
                mostReviewed = mostReviewedDone;
                mostReviewed.sort(function(a, b){
                    return b[1] - a[1];
                });
                Promise.all(topRated).then(function(topRatedDone){
                    topRated = topRatedDone;
                    topRated.sort(function(a, b){
                        return b[1] - a[1];
                    });
                    mostReviewed.slice(0, 6);
                    topRated.slice(0, 6);
                    for(var z=0; z<6; z++){
                        mostReviewedSorted.push(rMS[mostReviewed[z][0]]);
                    }
                    for(var z=0; z<6; z++){
                        topRatedSorted.push(rMS[topRated[z][0]]);
                    }
                    MoviesSaved.find({}).sort({ _id: -1 }).limit(3).exec(function(eMS3, rMS3){
                        if(eMS3) throw eMS3;
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
                                        producer1: rMS3[0].prodAddr,
                                        movieName1: toTitleCase(rMS3[0].title),
                                        movieName1Lower: rMS3[0].title,
                                        movieCountry1: rMS3[0].country,
                                        producer2: rMS3[1].prodAddr,
                                        movieName2: toTitleCase(rMS3[1].title),
                                        movieName2Lower: rMS3[1].title,
                                        movieCountry2: rMS3[1].country,
                                        producer3: rMS3[2].prodAddr,
                                        movieName3: toTitleCase(rMS3[2].title),
                                        movieName3Lower: rMS3[2].title,
                                        movieCountry3: rMS3[2].country,
                                        mostReviewed: mostReviewedSorted,
                                        topRated: topRatedSorted
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
                                                    producer1: rMS3[0].prodAddr,
                                                    movieName1: toTitleCase(rMS3[0].title),
                                                    movieName1Lower: rMS3[0].title,
                                                    movieCountry1: rMS3[0].country,
                                                    producer2: rMS3[1].prodAddr,
                                                    movieName2: toTitleCase(rMS3[1].title),
                                                    movieName2Lower: rMS3[1].title,
                                                    movieCountry2: rMS3[1].country,
                                                    producer3: rMS3[2].prodAddr,
                                                    movieName3: toTitleCase(rMS3[2].title),
                                                    movieName3Lower: rMS3[2].title,
                                                    movieCountry3: rMS3[2].country,
                                                    mostReviewed: mostReviewedSorted,
                                                    topRated: topRatedSorted
                                                });
                                            } else {
                                                res.render('index', {
                                                    title: 'Homepage',
                                                    loggedIn: 'true',
                                                    fullname: userLogged.fullname,
                                                    ethAddr: userLogged.ethaddr.toLowerCase(),
                                                    isProd: 'false',
                                                    isAdmin: 'false',
                                                    producer1: rMS3[0].prodAddr,
                                                    movieName1: toTitleCase(rMS3[0].title),
                                                    movieName1Lower: rMS3[0].title,
                                                    movieCountry1: rMS3[0].country,
                                                    producer2: rMS3[1].prodAddr,
                                                    movieName2: toTitleCase(rMS3[1].title),
                                                    movieName2Lower: rMS3[1].title,
                                                    movieCountry2: rMS3[1].country,
                                                    producer3: rMS3[2].prodAddr,
                                                    movieName3: toTitleCase(rMS3[2].title),
                                                    movieName3Lower: rMS3[2].title,
                                                    movieCountry3: rMS3[2].country,
                                                    mostReviewed: mostReviewedSorted,
                                                    topRated: topRatedSorted
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
                                producer1: rMS3[0].prodAddr,
                                movieName1: toTitleCase(rMS3[0].title),
                                movieName1Lower: rMS3[0].title,
                                movieCountry1: rMS3[0].country,
                                producer2: rMS3[1].prodAddr,
                                movieName2: toTitleCase(rMS3[1].title),
                                movieName2Lower: rMS3[1].title,
                                movieCountry2: rMS3[1].country,
                                producer3: rMS3[2].prodAddr,
                                movieName3: toTitleCase(rMS3[2].title),
                                movieName3Lower: rMS3[2].title,
                                movieCountry3: rMS3[2].country,
                                mostReviewed: mostReviewedSorted,
                                topRated: topRatedSorted
                            });
                        }
                    });
                });
            });
        }
    });
});

router.post('/search', function(req, res, next){
    var query = req.body.searchInput;
    MoviesSaved.find({ title: new RegExp(query, 'i') }, function(err, movies){
        if(req.session && req.session.adminId){
            res.render('search', {
                title: 'Search Results',
                loggedIn: 'true',
                fullname: "admin",
                ethAddr: "",
                isProd: 'false',
                isAdmin: 'true',
                searchResults: movies
            });
        } else if(req.session && req.session.userId){ 
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
	            	        res.render('search', {
	            	    	    title: 'Search Results',
	            	    	    loggedIn: 'true',
	            	    	    fullname: userLogged.fullname,
	            	    	    ethAddr: userLogged.ethaddr.toLowerCase(),
	            	    	    isProd: 'true',
	            	    	    isAdmin: 'false',
                                    searchResults: movies
	            	        });
	            	} else {
	            	    res.render('search', {
	            		title: 'Search Results',
	            		loggedIn: 'true',
	            		fullname: userLogged.fullname,
	            		ethAddr: userLogged.ethaddr.toLowerCase(),
	            		isProd: 'false',
	            		isAdmin: 'false',
                                searchResults: movies
	            	    });
	            	}
	                }
	            });
	        } else {
                    return res.redirect('/');
                }
            });
        } else {
	    res.render('search', {
	        title: 'Search Results',
	        loggedIn: 'false',
	        fullname: "",
	        ethAddr: "",
	        isProd: 'false',
	        isAdmin: 'false',
                searchResults: movies
	    });
        }
    });
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
            console.log(files);
            if (error) throw error;
            fs.rename(files.uploadMov.path, path.join(form.uploadDir, fields.ethAddr.toLowerCase() + '-' + fields.MovieTitle.toLowerCase() + '.mp4'));
            fs.rename(files.uploadBanner.path, path.join(form.uploadDir, fields.ethAddr.toLowerCase() + '-' + fields.MovieTitle.toLowerCase() + '-banner.jpg'));
            fs.rename(files.uploadPic.path, path.join(form.uploadDir, fields.ethAddr.toLowerCase() + '-' + fields.MovieTitle.toLowerCase() + '.jpg'));
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
                                    var newMovieSaved = {
                                        title: movieTitle,
                                        prodAddr: movieAddr,
                                        releasedate: res10.releasedate,
                                        genre: res10.genre,
                                        cast: res10.cast,
                                        description: res10.description,
                                        country: res10.country,
                                        price: res10.price
                                    };
                                    var movieSaved = new MoviesSaved(newMovieSaved);
                                    movieSaved.save(function(errMovieSaved){
                                        var currPath = path.join(__dirname, '/../uploads');
                                        var newPath = path.join(__dirname, '/../movie');
                                        var newPath2 = path.join(__dirname, '/../public/images');
                                        fs.rename(path.join(currPath, movieAddr + '-' + movieTitle.toLowerCase() + '.mp4'),
                                            path.join(newPath, movieAddr + '-' + movieTitle.toLowerCase() + '.mp4'));
                                        fs.rename(path.join(currPath, movieAddr + '-' + movieTitle.toLowerCase() + '.jpg'),
                                            path.join(newPath2, movieAddr + '-' + movieTitle.toLowerCase() + '.jpg'));
                                        fs.rename(path.join(currPath, movieAddr + '-' + movieTitle.toLowerCase() + '-banner.jpg'),
                                            path.join(newPath2, movieAddr + '-' + movieTitle.toLowerCase() + '-banner.jpg'));
                                        res.render('admin', {
                                            errMsg: "",
                                            resultMsg: "'" + movieTitle + "' " + "movie has successfully been added to movie list"
                                        });
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
        } else if (option == 'deleteMovie'){
            var movieAddr = req.body.movieAddr.toLowerCase();
            var movieTitle = req.body.movieTitle.toLowerCase();
            MoviesSaved.findOneAndDelete({
                title: movieTitle,
                prodAddr: movieAddr
            }, function(eDM, rDM){
                if(eDM){
                    res.render('admin', {
                        errMsg: "Error occured when trying to delete " + movieTitle,
                        resultMsg: ""
                    });
                }
                var thePath = path.join(__dirname, '/../movie');
                var imgPath = path.join(__dirname, '/../public/images');
                fs.unlink(path.join(thePath, movieAddr + '-' + movieTitle.toLowerCase() + '.mp4'), (errWhenRemoving) => {
                    if (errWhenRemoving) throw errWhenRemoving;
                    fs.unlink(path.join(imgPath, movieAddr + '-' + movieTitle.toLowerCase() + '.jpg'), (errWhenRemovingImg1) => {
                        if (errWhenRemovingImg1) throw errWhenRemovingImg1;
                        fs.unlink(path.join(imgPath, movieAddr + '-' + movieTitle.toLowerCase() + '-banner.jpg'), (errWhenRemovingImg2) => {
                            if (errWhenRemovingImg2) throw errWhenRemovingImg2;
                            res.render('admin', {
                                errMsg: "",
                                resultMsg: toTitleCase(movieTitle) + " is deleted successfully"
			    });
			});
                    });
                });
            });
        }
    } else {
        return res.redirect('/');
    }
});

router.post('/review', function(req, res, next){
    var theContract = new web3.eth.Contract(bc_conf.contract_abi, bc_conf.contract_addr);
    theContract.methods.getProducerName(req.body.producer).call({}, function(errProd, resProd){
        if(errProd) return res.redirect('/');
        theContract.methods.getMovieGenre(req.body.producer, req.body.movieName).call({}, function(errGenre, resGenre){
            if(errGenre) return res.redirect('/');
            theContract.methods.getMovieCountry(req.body.producer, req.body.movieName).call({}, function(errCountry, resCountry){
                if(errCountry) return res.redirect('/');
                theContract.methods.getMovieCasts(req.body.producer, req.body.movieName).call({}, function(errCasts, resCasts){
                    if(errCasts) return res.redirect('/');
                    theContract.methods.getMoviePrice(req.body.producer, req.body.movieName).call({}, function(errPrice, resPrice){
                        if(errPrice) return res.redirect('/');
                        theContract.methods.getMovieDesc(req.body.producer, req.body.movieName).call({}, function(errDesc, resDesc){
                            if(errDesc) return res.redirect('/');
                            theContract.methods.getMovieReleaseDate(req.body.producer, req.body.movieName).call({}, function(errDate, resDate){
                                if(errDate) return res.redirect('/');
                                theContract.methods.getMovieRatingSum(req.body.producer, req.body.movieName).call({}, function(errRating, resRating){
                                    if(errRating) return res.redirect('/');
                                    theContract.methods.getMovieRaterSum(req.body.producer, req.body.movieName).call({}, function(errRater, resRater){
                                        if(errRater) return res.redirect('/');
                                        User.findOne({
                                            _id: req.session.userId
                                        }).exec(function(eU, rU){
                                            if(eU || !rU){
                                                res.render('review', {
                                                    title: 'Movie Details',
                                                    ethAddr: "",
                                                    userName: "",
                                                    movieTitle: req.body.movieName,
                                                    movieTitleLower: req.body.movieName.toLowerCase(),
                                                    movieAddr: req.body.producer.toLowerCase(),
                                                    prodName: resProd,
                                                    movieGenre: resGenre,
                                                    movieCountry: resCountry,
                                                    movieDesc: resDesc,
                                                    moviePrice: resPrice,
                                                    movieCasts: resCasts,
                                                    movieDate: resDate,
                                                    movieRate: resRater == 0 ? "Not Rated" : resRating / resRater
                                                });
                                            } else {
                                                res.render('review', {
                                                    title: 'Movie Details',
                                                    ethAddr: rU.ethaddr,
                                                    userName: rU.fullname,
                                                    movieTitle: req.body.movieName,
                                                    movieTitleLower: req.body.movieName.toLowerCase(),
                                                    movieAddr: req.body.producer.toLowerCase(),
                                                    prodName: resProd,
                                                    movieGenre: resGenre,
                                                    movieCountry: resCountry,
                                                    movieDesc: resDesc,
                                                    moviePrice: resPrice,
                                                    movieCasts: resCasts,
                                                    movieDate: resDate,
                                                    movieRate: resRater == 0 ? "Not Rated" : resRating / resRater
                                                });
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
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
