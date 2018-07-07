const https = require('https');


var apiRequest = function apiRequest(options, cb) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let str = '';
  https.request(options, function(response) {
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      console.log(str);
      cb(null, str);
    });
  }).end();
}

var apiRequestPost = function apiRequestPost(options, postData, cb) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let str = '';
  var req = https.request(options, function(response) {
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      cb(null, str);
    });
    response.on('error', function (error) {
      console.log(error);
      cb(error);
    });
  });
  req.write(postData);
  req.end();
}

module.exports = {
  apiRequest: apiRequest,
  apiRequestPost: apiRequestPost
};
