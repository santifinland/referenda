var steps = require('./steps-library');


var getAllParties = function getAllParties(cb) {
  var options = {host: 'localhost', port: 3443, path: '/api/parties'};
  steps.apiRequest(options, cb);
}

var deleteAllParties = function deleteAllParties(token, cb) {
  var headers = {'x-access-token': token};
  var options = {host: 'localhost', port: 3443, path: '/api/parties', method: 'DELETE', headers: headers};
  steps.apiRequest(options, cb);
}

var getParty = function getParty(party, cb) {
  var options = {host: 'localhost', port: 3443, path: '/api/parties/' + party};
  steps.apiRequest(options, cb);
}

var postParty = function postParty(token, party, cb) {
  var postData = JSON.stringify({name: party, description: 'Party test', logo: 'testParty.png', quota: 23});
  var headers = {'Content-Type': 'application/json', 'Content-Length': postData.length, 'x-access-token': token};
  var options = {host: 'localhost', port: 3443, path: '/api/parties', method: 'POST', headers: headers};
  steps.apiRequestPost(options, postData, cb);
}

module.exports = {
  getAllParties: getAllParties,
  deleteAllParties: deleteAllParties,
  getParty: getParty,
  postParty: postParty
};
