var mongoose = require('mongoose');

var Users = mongoose.model('Users', { 
	email: String,
	pseudo: String,
	password: String,
	isLog: Boolean,
	token: String
});