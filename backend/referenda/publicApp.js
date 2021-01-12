/*
 * Referenda Node backend
 */

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const config = require('./config');
const publicLawRouter = require('./routes/publicLawRouter');


/* Database configuration */
mongoose.connect(config.mongoUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected correctly to server");
});


/* Referenda API */
const app = express();
app.all('*', function(req, res, next){  // Secure traffic only
  console.log('req: ',req.secure, req.hostname, req.url, req.socket.localPort, req.socket.remotePort, app.get('port'));
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
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/laws', publicLawRouter);

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
