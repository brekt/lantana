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

var db;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/lantana';
MongoClient.connect(url, function(err, database) {
  assert.equal(null, err);
  console.log('Connected to Lantana DB.');
  db = database;
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

app.post('/api/login', function(req, res, next) {
  db.collection('users').findOne({'username': req.body.username}, function(err, document) {
    if (err) {
      throw err;
    }
    if (document === null) {
      res.end('No such user.');
    } else {
      bcrypt.compare(req.body.password, document.password, function(err, match) {
        if (err) {
          throw err;
        } else if (match === true) {
          var clientToken = req.body.token;
          jwt.verify(clientToken, jwtKey, function(err, decoded) {
            if (err) {
              throw err;
            } else {
              console.log('Decoded token: ' + decoded);
              res.json({"loginStatus" : "success"});
            }
          });
        } else if (match === false) {
          res.json({"loginStatus" : "Password is incorrect."});
        } else {
          res.json({"loginStatus" : "An unknown error occured."});
        }
      });
    }
  });
});

app.get('/signup', function(req, res) {
  res.sendFile(__dirname + '/public/signup.html');
});

app.post('/api/doesuserexist', function(req, res) {
  console.log(req.body.username);
  var userToCheck = req.body.username;
  var userExists;
  db.collection('users').find({'username': userToCheck}).toArray(function(err, docs) {
    if (err) throw err;
    if (docs.length > 0) {
      userExists = true;
      res.json(userExists);
    }
    else {
      userExists = false;
      res.json(userExists);
    }
  });
});

app.post('/api/signup', function(req, res) {
  console.log(req.body.username, req.body.password, req.body.email);
  var newUsername = req.body.username;
  var newPassword = req.body.password;
  var newEmail = req.body.email;
  db.collection('users').find({'username': newUsername}).toArray(function(err, docs) {
    if (err) {
      throw err;
    }
    if (docs.length === 0) {
      bcrypt.hash(newPassword, 10, function(err, hash) {
        if (err) {
          throw err;
        }
        var user = {
          joinDate: new Date(),
          username: newUsername,
          password: hash,
          email: newEmail
        };
        db.collection('users').insert(user, function(err, result) {
          if (err) throw err;
        });
        var token = jwt.sign({'user': user.username, 'iss': 'Lantana', 'expiresInMinutes': 10080}, jwtKey);
        res.json(token);
      });
    }
    else {
      var userExists = true;
      res.send(userExists);
    }
  });
});

app.post('/api/savesong', function(req, res) {
  var song = req.body;
  console.log(song);
  db.collection('songs').insertOne({'song': song}, function(err, result) {
    if (err) {
      throw err;
    }
    console.log('Result: ' + result);
    res.json(result);
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
