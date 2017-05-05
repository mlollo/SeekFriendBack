var mongoose = require('mongoose');

var Friends = mongoose.model('Friends', { 
	friends1: String,
	friends2: String
});
