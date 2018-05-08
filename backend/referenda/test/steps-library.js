const https = require('https');


var apiRequest = function apiRequest(options, cb) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let str = '';
  https.request(options, function(response) {
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      console.log(str)
      cb(null, str);
    });
  }).end();
}

module.exports = {
  apiRequest: apiRequest
};
