var express = require('express');
var mongoose = require('mongoose');
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

router.get('/getpseudo', function(req, res, next) {
	Users.find(function(err, users){
		if(err)
			res.send('error!');
		else{
			var jsonArr = [];
			for (var i in users) {
			    jsonArr.push({
			        pseudo: users[i].pseudo,
			    });
			}
			res.send(jsonArr);
		}
	});
});

router.get('/getall', function(req, res, next) {
	Users.find(function(err, users){
		if(err)
			res.send('error!');
		else{
			var jsonArr = [];
			for (var i in users) {
			    jsonArr.push(users[i]);
			}
			res.send(jsonArr);
		}
	});
});

router.post('/getbyemailnpseudo', function(req, res, next) {
	Users.find({$or:[ {'email' : req.body.email}, {'pseudo':req.body.pseudo}]},function(err, users){
		if(err)
			res.send('error!');
		else{
			var jsonArr = [];
			for (var i in users) {
			    jsonArr.push(users[i]);
			}
			res.send(jsonArr);
		}
	});
});

router.post('/getbyemail', function(req, res, next) {
	Users.find({'email' : req.body.email},function(err, users){
		if(err)
			res.send('error!');
		else{
			var jsonArr = [];
			for (var i in users) {
			    jsonArr.push(users[i]);
			}
			res.send(jsonArr);
		}
	});
});

router.post('/login', function(req, res, next) {
	Users.find({'email' : req.body.email},function(err, users){
		if(err)
			res.send('error!');
		else{
			var jsonArr = [];
			for (var i in users) {
				users[i].isLog = true;
				jsonArr.push(users[i]);
			}
			res.send(jsonArr);
		}
	});
});

router.post('/logout', function(req, res, next) {
	Users.find({'email' : req.body.email},function(err, users){
		if(err)
			res.send('error!');
		else{
			var jsonArr = [];
			for (var i in users) {
				users[i].isLog = false;
				jsonArr.push(users[i]);
			}
			res.send(jsonArr);
		}
	});
});

router.post('/add',function(req,res,next){
	var user = new Users({ 
		email: req.body.email,
		pseudo: req.body.pseudo,
		password: req.body.password,
		isLog: false
	});
	// console.log(Object.keys(req.body)[0]);c
	console.log(req.body);
	user.save(function (err) {
	  if (err) {
	    console.log(err);
	  } else {
	    console.log('Saved!');
	  }
	});
	console.log('user '+user+' saved!');
	var jsonArr = [];
	for (var i in users) {
		jsonArr.push(users[i]);
	}
	res.send(jsonArr);
});

router.get('/reset',function(req,res,next){
	Users.remove(function (err) {
	  if (err) 
	  	res.send('reset error');
	  else
	  	res.send('remove all success!');
	});
});
router.get('/rm',function(req,res,next){
	if(req.body.email != undefined){
		Users.remove({email: req.body.email},function (err,users) {
		  if (err) 
		  	res.send('rm error');
		  else
		  	res.send('remove '+ users +' success!');
		});
	}else
		res.send('Please add an email get parameter!')
});

module.exports = router;
