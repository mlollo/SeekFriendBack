var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Users = mongoose.model('Users', { 
	email: String,
	pseudo: String,
	password: String
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('Users Route');
});

router.get('/get', function(req, res, next) {
	Users.find(function(err, users){
		if(err)
			res.send('error!');
		else{
			var str = '';
			for (var user in users) {
				str += user;
				str += '<br>';
			}
			res.send(users);
		}
	});
});

router.post('/add',function(req,res,next){
	var user = new Users({ 
		email: req.body.email,
		pseudo: req.body.pseudo,
		password: req.body.password
	});

	user.save(function (err) {
	  if (err) {
	    console.log(err);
	  } else {
	    console.log('Saved!');
	  }
	});
	res.send('user '+user+' saved!');
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
