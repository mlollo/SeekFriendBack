var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Friends = mongoose.model('Friends', { 
	friends1: String,
	friends2: String
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('Friends Route');
});

router.get('/getall', function(req, res, next) {
	Friends.find(function(err, users){
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

router.post('/addfriend',function(req,res,next){
	var friendship = new Friends({ 
		friends1: req.body.friends1,
		friends2: req.body.friends2
	});
	// console.log(Object.keys(req.body)[0]);c
	console.log(req.body);
	friendship.save(function (err) {
	  if (err) {
	    console.log(err);
	  } else {
	    console.log('Saved!');
	  }
	});
	console.log('friendship '+ friendship +' saved!');
	res.send(friendship);
});

router.post('/isfriend',function(req,res,next){
	Friends.find({
		$or:[
			{$and: [{'friends1' : req.body.friends1}, {'friends2' : req.body.friends2} ]},
			{$and: [{'friends1' : req.body.friends2}, {'friends2' : req.body.friends1} ]},
			]
		},function(err, friends){
		// console.log(friends);
		var json = {isfriend: false};
		if(err)
			res.send(json);
		else if(friends.length){
			json.isfriend = true;
			console.log(json);
			res.send(json);
		}else{
			console.log(json);
			res.send(json);
		}
	});
});

router.post('/removeFriend',function(req,res,next){
	Friends.remove({
		$or:[
			{$and: [{'friends1' : req.body.friends1}, {'friends2' : req.body.friends2} ]},
			{$and: [{'friends1' : req.body.friends2}, {'friends2' : req.body.friends1} ]},
			]
		},function (err,friendship) {
		  if (err) 
		  	res.send('rm error');
		  else
		  	res.send('remove '+ friendship +' success!');
		});
});

router.get('/reset',function(req,res,next){
	Friends.remove(function (err) {
	  if (err) 
	  	res.send('reset error');
	  else
	  	res.send('remove all success!');
	});
});
module.exports = router;
