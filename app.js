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

function authenticate(user, pw) {
    console.log('authenticate called');
};

// app.post('/login', function(req, res) {
//     var token = jwt.sign({
//     user.username}, jwtKey);
//     // TODO: ?
// })

app.get('/signup', function(req, res) {
    res.sendFile(__dirname + '/public/signup.html');
});

app.post('/signup', function(req, res) {
    var newUsername = req.body.username;
    var newPassword = req.body.password;
    var newEmail = req.body.email;
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
