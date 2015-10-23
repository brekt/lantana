var express = require('express');
var router = express.Router();
var level = require('level');
var db = level('./lantanadb');
var uuid = require('uuid');
var secretKey = uuid.v4();



// Routing

router.get('/', function(req, res, next) {
	res.sendFile('index.html');
});

router.get('/login', function(req, res, next) {
	res.sendFile('login.html');
});

router.get('/signup', function(req, res, next) {
	res.sendfile('signup.html');
});

// The code below tested LevelDB.

// db.put('greeting', 'Hello world.', function(err) {
// 	if (err) {
// 		throw err;
// 	}
// 	db.get('greeting', function(err, value) {
// 		if (err) {
// 			throw err;
// 		}
// 		console.log(value);
// 	});
// });


module.exports = router;
