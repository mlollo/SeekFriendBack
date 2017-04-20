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

module.exports = router;
