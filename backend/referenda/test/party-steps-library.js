var steps = require('./steps-library');


var getAllParties = function getAllParties(cb) {
  var options = {host: 'localhost', port: 3443, path: '/api/parties'};
  steps.apiRequest(options, cb);
}

var getParty = function getParty(party, cb) {
  var options = {host: 'localhost', port: 3443, path: '/api/parties/' + party};
  steps.apiRequest(options, cb);
}

module.exports = {
  getAllParties: getAllParties,
  getParty: getParty
};
