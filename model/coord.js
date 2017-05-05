var mongoose = require('mongoose');

var Coords = mongoose.model('Coords', { 
	user_id: String,
	lat: String,
	lng: String,
	date: String
});
