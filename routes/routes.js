var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var expressJWT = require('express-jwt');
var router = express.Router();

var Users = mongoose.model('Users', { 
	email: String,
	pseudo: String,
	password: String,
	isLog: Boolean,
	token: String
});

var Coords = mongoose.model('Coords', { 
	user_id: String,
	lat: String,
	lng: String,
	date: String
});

var Friends = mongoose.model('Friends', { 
	friends1: String,
	friends2: String
});

/* GET users listing. */
router.get('/users', function(req, res, next) {
	res.status(200).send('Users Route');
});

router.get('/users/getall', function(req, res, next) {
	Users.find(function(err, users){
		if(err) res.status(500).json(err);
		var jsonArr = [];
		// for (var i in users) {
		//     jsonArr.push({email:users[i].email,pseudo:users[i].pseudo,isLog:users[i].isLog});
		// }
		users.forEach(function(value,key){
			console.log(value);
		    jsonArr.push({email:value.email,pseudo:value.pseudo,isLog:value.isLog,token: value.token});
		});
		res.status(200).json(jsonArr);
	});
});

router.post('/users/add',function(req,res,next){
	if(!req.body.email || !req.body.pseudo || !req.body.password){
		res.status(400).send("email, pseudo and password is required");
		return;
	}
	Users.find({$or:[ {'email' : req.body.email}, {'pseudo':req.body.pseudo}]},function(err, users){
		if(err) res.status(500).json(err);
		console.log(users.length);
		if(users.length === 0){
			var user = new Users({ 
				email: req.body.email,
				pseudo: req.body.pseudo,
				password: bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10)),
				isLog: false,
				token: jwt.sign({username: req.body.email},'./§seekfriendlamartilollosefi./§ ./§secret./§ ./§0987654321./§')
			});
			console.log(user);
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

router.post('/users/login', function(req, res, next) {
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

router.post('/users/getcoords', function(req, res, next) {
	if(req.body.islog == undefined){
		res.status(400).send("islog is required");
		return;
	}
	Users.find().exec().then(function(users){
	    var result = [];
        return Coords.find().exec().then(function(coords){return [users, coords];});
	}).then(function(result){
        return Friends.find().exec().then(function(friends){
			result.push(friends);
			return result;
		})
    }).then(function(result){
      var users = result[0];
      var coords = result[1];
      var friends = result[2];
      var userlist = [];
      users.forEach(function(value,key){
      	var infoc = [];
      	coords.forEach(function(value1,key1){
      		if(value1.user_id == value._id){
      			infoc.push(value1);
      		}
      	});
      	var isFriend = false;
      	if(req.body.islog === true){
      		if(req.body.user_id != value._id){
		      	friends.forEach(function(value2,key2){
		      		if((value2.friends1 == value._id && value2.friends2 == req.body.user_id) 
		      		|| (value2.friends1 == req.body.user_id && value2.friends2 == value._id)){
		      			isFriend = true;
		      		}
		      	});
		    }
	    }
	    if(req.body.islog == true){
      		if(req.body.user_id != value._id){
		      	userlist.push({
					user: {
						user_id: value._id,
						email: value.email,
						pseudo: value.pseudo,
						isLog: value.isLog
					},
					info: infoc,
					isfriend: isFriend
				});
		    }
		}else{
			userlist.push({
				user: {
					user_id: value._id,
					email: value.email,
					pseudo: value.pseudo,
					isLog: value.isLog
				},
				info: infoc,
				isfriend: isFriend
			});
		}
      });
      // console.log(userlist);
	  res.status(200).json(userlist);
    }).then(undefined, function(err){
	  if(err) res.status(500).json(err);
    });
});

router.post('/users/onsearch', function(req, res, next) {
	if(req.body.islog == undefined){
		res.status(400).send("islog is required");
		return;
	}
	if(req.body.search == undefined){
		res.status(400).send("search is required");
		return;
	}
	var regexp = new RegExp("^"+ req.body.search);
	Users.find({'pseudo': regexp}).exec().then(function(users){
	    var result = [];
        return Coords.find().exec().then(function(coords){return [users, coords];});
	}).then(function(result){
        return Friends.find().exec().then(function(friends){
			result.push(friends);
			return result;
		})
    }).then(function(result){
      var users = result[0];
      var coords = result[1];
      var friends = result[2];
      var userlist = [];
      users.forEach(function(value,key){
      	var infoc = [];
      	coords.forEach(function(value1,key1){
      		if(value1.user_id == value._id){
      			infoc.push(value1);
      		}
      	});
      	var isFriend = false;
      	if(req.body.islog === true){
      		if(req.body.user_id != value._id){
		      	friends.forEach(function(value2,key2){
		      		if((value2.friends1 == value._id && value2.friends2 == req.body.user_id) 
		      		|| (value2.friends1 == req.body.user_id && value2.friends2 == value._id)){
		      			isFriend = true;
		      		}
		      	});
		    }
	    }
	    if(req.body.islog == true){
      		if(req.body.user_id != value._id){
		      	userlist.push({
					user: {
						user_id: value._id,
						email: value.email,
						pseudo: value.pseudo,
						isLog: value.isLog
					},
					info: infoc,
					isfriend: isFriend
				});
		    }
		}else{
			userlist.push({
				user: {
					user_id: value._id,
					email: value.email,
					pseudo: value.pseudo,
					isLog: value.isLog
				},
				info: infoc,
				isfriend: isFriend
			});
		}
      });
      // console.log(userlist);
	  res.status(200).json(userlist);
    }).then(undefined, function(err){
	  if(err) res.status(500).json(err);
    });
});

router.delete('/users',function(req,res,next){
	Users.remove(function (err) {
	  if(err) res.status(500).json(err);
	  res.status(200).send('Remove all success !');
	});
});


router.delete('/users/rm',function(req,res,next){
	if(!req.body.email){
		res.status(400).send("email is required");
		return;
	}
	Users.remove({email: req.body.email},function (err,users) {
	  	if(err) res.status(500).send(err);
	    console.log('remove '+ users +' success!');
		res.status(200).send('remove '+ users.pseudo +' success!');
	});
});

router.delete('/coords',function(req,res,next){
	Coords.remove(function (err) {
	  if(err) res.status(500).json(err);
	  res.status(200).send('Remove all success !');
	});
});

router.delete('/coords/rm',function(req,res,next){
	console.log(req.body);
	if(!req.body.id){
		res.status(400).send("id is required");
		return;
	}
	Coords.remove({_id: req.body.id},function (err,coord) {
		if(err) res.status(500).json(err);
	  	res.status(200).send('remove '+ coord +' success!');
	});
});

router.delete('/friends',function(req,res,next){
	Friends.remove(function (err) {
		if(err) res.status(500).json(err);
	  	res.status(200).send('remove all success!');
	});
});

router.delete('/friends/rm',function(req,res,next){
	if(!req.body.id){
		res.status(400).send("id is required");
		return;
	}
	Friends.remove({_id: req.body.id},function (err,friends) {
		if(err) res.status(500).json(err);
	  	res.status(200).send('remove '+ friends +' success!');
	});
});




router.use(function(req, res, next){
	if(!req.body.token){
		res.status(401).send("token is required");
		return;
	}else{
		var token = req.body.token;
	}
	if(!req.body.email){
		res.status(400).send("email is required");
		return;
	}else{
		var email = req.body.email;
	}
	Users.findOne({"email": email},function(err,user){
		jwt.verify(token,'./§seekfriendlamartilollosefi./§ ./§secret./§ ./§0987654321./§',function(err,decoded){
			if(err) res.status(400).send("wrong token");
			//console.log(decoded);
			next();
		});
	});
});

router.post('/users/logine', function(req, res, next) {
	Users.findOne({'email' : req.body.email},function(err, user){
		if(err) res.status(500).json(err);
		Users.findOneAndUpdate({'email' : req.body.email},{'isLog': true },function(err, user){
			if(err) res.status(500).json(err);
			res.status(200).json({valid: true, "user": user});
		});
	});
});


router.post('/users/addcoords',function(req,res,next){
	var coord = new Coords({ 
		user_id: req.body.user_id,
		lat: req.body.lat,
		lng: req.body.lng,
		date: req.body.date
	});
	coord.save(function (err) {
	  if (err) res.status(500).json(err);
	  console.log('coord '+coord+' saved!');
	  res.status(200).send(coord);
	});
});

router.post('/users/onsearchprofil', function(req, res, next) {
	var regexp = "";
	if(!req.body.user_id){
		res.status(400).send("user_id is required");
		return;
	}
	if(typeof req.body.search == undefined){
		res.status(400).send("search is required");
	}
	if(req.body.search.length != 0){
		regexp = new RegExp("^"+ req.body.search);
	}else{
		regexp = "";
	}
	Users.findOne({'email' : req.body.email}).exec().then(function(user){
	    var result = [{email:user.email,pseudo:user.pseudo,isLog:user.isLog}];
	    if(req.body.search.length != 0){
	    	return Coords.find({'user_id' : req.body.user_id, 'date': regexp}).exec().then(function(coords){
				result.push(coords);
				return result;
    		});
	    }else{
	    	return Coords.find({'user_id' : req.body.user_id}).exec().then(function(coords){		
				result.push(coords);
				return result;
    		});
	    }   
	}).then(function(result){
      	res.status(200).json({'user': result[0], 'info': result[1]});
    }).then(undefined, function(err){
	  if(err) res.status(500).json(err);
    });
});

router.post('/users/addfriend',function(req,res,next){
	var friendship = new Friends({ 
		friends1: req.body.friends1,
		friends2: req.body.friends2
	});
	// console.log(Object.keys(req.body)[0]);c
	// console.log(req.body);
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

router.post('/users/isfriend',function(req,res,next){
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

router.post('/users/removeFriend',function(req,res,next){
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


router.post('/users/logout', function(req, res, next) {
	Users.findOneAndUpdate({'email' : req.body.email},{'isLog': false },function(err, user){
		if(err) res.status(500).json(err);
		res.status(200).json(user);
	});
});


router.post('/users/getbyemail', function(req, res, next) {
	Users.find({'email' : req.body.email},function(err, users){
		if(err) res.status(500).json(err);
		res.status(200).json(users);
	});
});

router.post('/users/getbyid', function(req, res, next) {
	if(!req.body.user_id){
		res.status(400).send("user_id is required");
		return;
	}
	Users.find({'_id' : req.body.user_id},function(err, users){
		if(err) res.status(500).json(err);
		res.status(200).json(users);
	});
});

router.put('/users/pw', function(req, res, next) {
	if(!req.body.password){
		res.status(400).send("password is required");
		return;
	}
	if(!req.body.newpassword){
		res.status(400).send("newpassword is required");
		return;
	}
	console.log(req.body); 
	Users.findOne({'email' : req.body.email},function(err, user){
		if(err) res.status(500).json(err);
		if(bcrypt.compareSync(req.body.password, user.password)){
			Users.findOneAndUpdate({'email' : req.body.email},{'password': bcrypt.hashSync(req.body.newpassword,bcrypt.genSaltSync(10))},function(err, user){
				if(err) res.status(500).json(err);
				res.status(200).json({valid: true, "user": user});
			});
		}else{
			res.status(401).json({valid:false});
		}
	});
});


module.exports = router;
