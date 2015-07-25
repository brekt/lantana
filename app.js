var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var jwtKey = process.env.LANTANAKEY;

//------------- Mongo

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lantana';
MongoClient.connect(url, function(err, database) {
  assert.equal(null, err);
  console.log('Connected to Lantana DB.');
  app.set('db', database);
});

//-------------- View Engine

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//-------------- Middleware

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

//------------- Routing

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', function(req, res, next) {
  db = app.get('db');
  db.collection('users').findOne({'username': req.body.username}, function(err, document) {
    if (err) throw err;
    bcrypt.compare(req.body.password, document.password, function(err, match) {
      if (err) throw err;
      if (match === true) {
        res.json({
          'username': authenticate(document.username),
          'user': document
        });
      }
      else {
        res.end('Password does not match.');
      }
    });
  });
});

app.post('/api/authenticate', function(req, res) {
  db = app.get('db');
  db.collection('users').findOne({'username': req.body.username}, function(err, document) {
    if (err) throw err;
    bcrypt.compare(req.body.password, document.password, function(err, match) {
      if (err) throw err;
      if (match) {
        var tokenVer = jwt.verify(document, jwtKey, {iss: 'Lantana'});
        res.json({
          tokenVer
        });
      }
      else {
        res.end('Password does not match.');
      }
    });
  });
});


// app.post('/login', function(req, res) {
//     var token = jwt.sign({
//     user.username}, jwtKey);
//     // TODO: ?
// })

app.get('/signup', function(req, res) {
  res.sendFile(__dirname + '/public/signup.html');
});

app.post('/api/doesuserexist', function(req, res) {
  console.log(req.body.username);
  var userToCheck = req.body.username;
  db = app.get('db');
  db.collection('users').find({'username': userToCheck}).toArray(function(err, docs) {
    if (err) throw err;
    if (docs.length > 0) {
      var userExists = true;
      res.json(userExists);
    }
    else {
      var userExists = false;
      res.json(userExists);
    }
  });
});

app.post('/signup', function(req, res) {
  var newUsername = req.body.username;
  var newPassword = req.body.password;
  var newEmail = req.body.email;
  db = app.get('db');
  db.collection('users').find({'username': newUsername}).toArray(function(err, docs) {
    if (err) throw err;
    if (docs.length === 0) {
      bcrypt.hash(newPassword, 10, function(err, hash) {
        if (err) throw err;
        var user = new makeUser(newUsername, hash, newEmail);
        console.log(user);
        db = app.get('db');
        db.collection('users').insert(user, function(err, result) {
          if (err) throw err;
          console.log(result);
        });
        function makeUser(un, pw, em) {
          this.joinDate = new Date();
          this.username = un;
          this.password = hash;
          this.email = em;
        }
      });
      res.redirect('/');
    }
    else {
      var userExists = true;
      res.send(userExists);
    }
  });
});

//------------- Error handling

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
