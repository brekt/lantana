var express = require('express');
var router = express.Router();

var level = require('level');
var db = level('./lantanadb');

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

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile('index.html');
  // res.render('index', { title: 'Express' });
});

module.exports = router;
