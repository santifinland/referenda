/*
 * Referenda Node backend
 */

const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;

const config = require('./config');
const users = require('./routes/users');
const lawRouter = require('./routes/lawRouter');
const partyRouter = require('./routes/partyRouter');
const User = require('./models/user');


/* Database configuration */
mongoose.connect(config.mongoUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});


/* Referenda API */
const app = express();
app.all('*', function(req, res, next){  // Secure traffic only
  console.log('req: ',req.secure, req.socket.remoteAddress, req.hostname, req.url, req.socket.localPort,
      req.socket.remotePort, app.get('port'));
  if (req.secure) {
    res.setHeader('Access-Control-Allow-Origin', 'https://referenda.es');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');
    res.setHeader('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict');
    return next();
  }
  console.log('sec port: ', app.get('secPort'));
  console.log('https://'+req.hostname+':'+app.get('secPort')+req.url);
  res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
});
//app.use(express.favicon());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));
app.use(session({
  secret: 're fe ren da',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  name: 'referenda-server-cookie'
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users', users);
app.use('/api/laws', lawRouter);
app.use('/api/parties', partyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  console.log('error: ', err);
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
    //error: {}
  });
});

module.exports = app;
