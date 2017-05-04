var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router();

var Users = mongoose.model('Users', { 
	email: String,
	pseudo: String,
	password: String,
	isLog: Boolean
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('Users Route');
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

router.get('/getall', function(req, res, next) {
	Users.find(function(err, users){
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

router.post('/login', function(req, res, next) {
	if(!req.body.email || !req.body.password){
		res.status(400).send("email and password is required");
		return;
	}
	Users.findOne({'email' : req.body.email},function(err, user){
		if(err) res.status(500).json(err);
		if(bcrypt.compareSync(req.body.password, user.password)){
			var jwtoken = jwt.sign({username: req.body.email},'./§seekfriendlamartilollosefi./§ ./§secret./§ ./§0987654321./§');
			Users.findOneAndUpdate({'email' : req.body.email},{'isLog': true },function(err, user){
				if(err) res.status(500).json(err);
				res.status(200).json({valid: true,token: jwtoken, "user": user});
			});
		}else{
			res.status(401).json({valid:false,token: null});
		}
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
				isLog: false
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
