var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var expressJWT = require('express-jwt');
var router = express.Router();
var Users = require('../model/user.js');
var Coords = require('../model/coord.js');
var Friends = require('../model/friend.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('Users Route');
});

router.get('/getall', function(req, res, next) {
	Users.find(function(err, users){
		if(err) res.status(500).json(err);
		res.status(200).json({email:users.email,pseudo:users.pseudo,isLog:users.isLog});
	});
});

router.post('/add',function(req,res,next){
	if(!req.body.email || !req.body.pseudo || !req.body.password){
		res.status(400).send("email, pseudo and password is required");
		return;
	}
	Users.find({$or:[ {'email' : req.body.email}, {'pseudo':req.body.pseudo}]},function(err, users){
		if(err) res.status(500).json(err);
		console.log(users.length);
		if(users.length == 0){
			var user = new Users({ 
				email: req.body.email,
				pseudo: req.body.pseudo,
				password: bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10)),
				isLog: false,
				token: jwt.sign({username: req.body.email},'./§seekfriendlamartilollosefi./§ ./§secret./§ ./§0987654321./§')
			});
			user.save(function (err) {
				if(err) res.status(500).json(err);
			    console.log('[userObject = \n'+user+'] \nsaved!');
				res.status(200).json({invalid: false});
			});
		}else{
			res.status(200).json({invalid: true});
		}
	});
	
});

router.post('/login', function(req, res, next) {
	if(!req.body.email || !req.body.password){
		res.status(400).send("email and password is required");
		return;
	}
	Users.findOne({'email' : req.body.email},function(err, user){
		if(err) res.status(500).json(err);
		if(bcrypt.compareSync(req.body.password, user.password)){
			Users.findOneAndUpdate({'email' : req.body.email},{'isLog': true },function(err, user){
				if(err) res.status(500).json(err);
				res.status(200).json({valid: true, "user": user});
			});
		}else{
			res.status(401).json({valid:false});
		}
	});
});


router.post('/getcoords', function(req, res, next) {
	Users.find(function(err, users){
		if(err) res.status(500).json(err);
		var userlist = [];
		users.forEach(function(value,key){
			if(req.body.islog){
				if(req.body.user_id !== value._id){
					Friends.find({
						$or:[
							{$and: [{'friends1' : req.body.user_id}, {'friends2' : value._id} ]},
							{$and: [{'friends1' : value._id}, {'friends2' : req.body.user_id} ]},
							]
						},function(err, friends){
						if(err) res.status(500).json(err);
						var isFriend = function(){if(friends.length){return true;}else{return false;}};
						Coords.find({user_id : value._id},function(err, coords){
							if(err)  res.status(500).json(err);
							else
								userlist.push({
									user: {
										user_id: value._id,
										email: value.email,
										pseudo: value.pseudo,
										isLog: value.isLog
									},
									info: coords,
									isfriend: isFriend
								}); 
						});
					});
				}
			}else{
				Coords.find({user_id : req.body.user_id},function(err, coords){
					if(err)  res.status(500).json(err);
					else
						userlist.push({
							user: {
								user_id: value._id,
								email: value.email,
								pseudo: value.pseudo,
								isLog: value.isLog
							},
							info: coords,
							isfriend: false
						}); 
				});
			}
		});
		res.status(200).send(userlist);
	});
});

router.use(function(req, res, next){
	if(!req.body.token || !req.query.token || !req.headers['token']){
		res.status(401).send("token is required");
		return;
	}else{
		var token = req.body.token || req.query.token || req.headers['token'];
	}
	if(!req.body.email || !req.query.email || !req.headers['email']){
		res.status(400).send("email is required");
		return;
	}else{
		var email = req.body.email || req.query.email || req.headers['email'];
	}
	Users.findOne({"email": email},function(err,user){
		expressJWT.verify(token,'./§seekfriendlamartilollosefi./§ ./§secret./§ ./§0987654321./§',function(err,decoded){
			if(err) res.status(400).send("wrong token");
			console.log(decoded);
			next();
		});
	});
});

router.post('/getbypseudo', function(req, res, next) {
	if(!req.body.pseudo){
		res.status(400).send("pseudo is required");
		return;
	}
	var regexp = new RegExp("^"+ req.body.pseudo);
	Users.find({'pseudo': regexp},function(err, users){
		if(err) res.status(500).json(err);
		res.status(200).json(users);
	});
});


router.post('/getbyemailnpseudo', function(req, res, next) {
	if(!req.body.pseudo || !req.body.email){
		res.status(400).send("pseudo and email is required");
		return;
	}
	Users.find({$or:[ {'email' : req.body.email}, {'pseudo':req.body.pseudo}]},function(err, users){
		if(err) res.status(500).json(err);
		res.status(200).json(users);
	});
});
	
router.post('/getbyemail', function(req, res, next) {
	if(!req.body.email){
		res.status(400).send("email is required");
		return;
	}
	Users.find({'email' : req.body.email},function(err, users){
		if(err) res.status(500).json(err);
		res.status(200).json(users);
	});
});

router.post('/getbyid', function(req, res, next) {
	if(!req.body.user_id){
		res.status(400).send("user_id is required");
		return;
	}
	Users.find({'_id' : req.body.user_id},function(err, users){
		if(err) res.status(500).json(err);
		res.status(200).json(users);
	});
});

router.post('/logout', function(req, res, next) {
	if(!req.body.email){
		res.status(400).send("email is required");
		return;
	}
	Users.findOneAndUpdate({'email' : req.body.email},{'isLog': false },function(err, user){
		if(err) res.status(500).json(err);
		res.status(200).json(users);
	});
});

router.delete('/reset',function(req,res,next){
	Users.remove(function (err) {
	  if(err) res.status(500).json(err);
	  res.status(200).send('Remove all success !');
	});
});
router.delete('/rm',function(req,res,next){
	if(!req.body.email || !req.body.pseudo || !req.body.password){
		res.status(400).send("email is required");
		return;
	}
	Users.remove({email: req.body.email},function (err,users) {
	  	if(err) res.status(500).send(err);
	    console.log('remove '+ users.pseudo +' success!');
		res.status(200).send('remove '+ users.pseudo +' success!');
	});
});

module.exports = router;
