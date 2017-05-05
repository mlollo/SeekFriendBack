var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('Coord Route');
});

router.get('/getallcoord', function(req, res, next) {
	// console.log(req.body.user_id);
	Coords.find(function(err, coords){
		if(err)
			res.send('error!');
		else{
			var jsonArr = [];
			for (var i in coords) {
			    jsonArr.push(coords[i]);
			}
			res.send(jsonArr);
		}
	});
});

router.post('/getall', function(req, res, next) {
	Coords.find({'user_id' : req.body.user_id},function(err, coords){
		if(err)
			res.send('error!');
		else{
			var jsonArr = [];
			for (var i in coords) {
			    jsonArr.push(coords[i]);
			}
			res.send(jsonArr);
		}
	});
	// console.log(req.body.user_id);
});

router.post('/getbydate', function(req, res, next) {
	var regexp = new RegExp("^"+ req.body.date);
	Coords.find({'user_id' : req.body.user_id, 'date': regexp},function(err, coords){
		if(err)
			res.send('error!');
		else{
			var jsonArr = [];
			for (var i in coords) {
			    jsonArr.push(coords[i]);
			}
			res.send(jsonArr);
		}
	});
	// console.log(req.body.user_id);
});

router.post('/add',function(req,res,next){
	var coord = new Coords({ 
		user_id: req.body.user_id,
		lat: req.body.lat,
		lng: req.body.lng,
		date: req.body.date
	});
	// console.log(Object.keys(req.body)[0]);c
	// console.log(req.body);
	coord.save(function (err) {
	  if (err) {
	    console.log(err);
	  } else {
	    console.log('Saved!');
	  }
	});
	console.log('coord '+coord+' saved!');
	var jsonArr = [];
	jsonArr.push(coord);
	res.send(jsonArr);
});
router.post('/rm',function(req,res,next){
	if(req.body.id != undefined){
		Coords.remove({_id: req.body.id},function (err,coord) {
		  if (err) 
		  	res.send('rm error');
		  else
		  	res.send('remove '+ coord +' success!');
		});
	}else
		res.send('Please add an id post parameter!')
});

module.exports = router;
