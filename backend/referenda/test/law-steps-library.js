var steps = require('./steps-library');


var getAllLaws = function getAllLaws(cb) {
  var options = {host: 'localhost', port: 3443, path: '/api/laws'};
  steps.apiRequest(options, cb);
}

var postLaw = function postLaw(token, law, cb) {
  var postData = JSON.stringify(law);
  var headers = {'Content-Type': 'application/json', 'Content-Length': postData.length, 'x-access-token': token};
  var options = {host: 'localhost', port: 3443, path: '/api/laws', method: 'POST', headers: headers};
  steps.apiRequestPost(options, postData, cb);
}

var deleteAllLaws = function deleteAllLaws(token, cb) {
  var headers = {'x-access-token': token};
  var options = {host: 'localhost', port: 3443, path: '/api/laws', method: 'DELETE', headers: headers};
  steps.apiRequest(options, cb);
}

var getLaw = function getLaw(slug, cb) {
  var options = {host: 'localhost', port: 3443, path: '/api/laws/' + slug};
  steps.apiRequest(options, cb);
}

module.exports = {
  getAllLaws: getAllLaws,
  postLaw: postLaw,
  deleteAllLaws: deleteAllLaws,
  getLaw: getLaw
};
