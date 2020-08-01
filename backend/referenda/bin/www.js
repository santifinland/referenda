#!/usr/bin/env node
/**
 * Referenda Node backend
 */

const debug = require('debug')('rest-server:server');
const https = require('https');
const fs = require('fs');

const app = require('../app');


/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('secPort', port+443);

/**
 * Create HTTPS server.
 */
const options = {
  key: fs.readFileSync(__dirname+'/referenda.es.key'),
  cert: fs.readFileSync(__dirname+'/referenda.es.cer')
};
const secureServer = https.createServer(options,app);

/**
 * Listen on provided port, on all network interfaces.
 */
secureServer.listen(app.get('secPort'), function() {
   console.log('Server listening on port ',app.get('secPort'));
});
secureServer.on('error', onError);
secureServer.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = secureServer.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
