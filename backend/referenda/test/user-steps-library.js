var steps = require('./steps-library');


var deleteAllUsers = function deleteAllUsers(token, cb) {
  var headers = {'x-access-token': token};
  var options = {host: 'localhost', port: 3443, path: '/api/users', method: 'DELETE', headers: headers};
  steps.apiRequest(options, cb);
}

var findUser = function findUser(user, cb) {
  var options = {host: 'localhost', port: 3443, path: '/api/users/find/' + user};
  steps.apiRequest(options, cb);
}

var login = function login(username, password, cb) {
  var postData = JSON.stringify({username: username, password: password});
  var headers = {'Content-Type': 'application/json', 'Content-Length': postData.length};
  var options = {host: 'localhost', port: 3443, path: '/api/users/login/', method: 'POST', headers: headers};
  steps.apiRequestPost(options, postData, cb);
}

var loginAsAdmin = function loginAsAdmin(cb) {
  var username = 'admin';
  var password = '1234';
  var postData = JSON.stringify({username: username, password: password});
  var headers = {'Content-Type': 'application/json', 'Content-Length': postData.length};
  var options = {host: 'localhost', port: 3443, path: '/api/users/login/', method: 'POST', headers: headers};
  steps.apiRequestPost(options, postData, cb);
}

var logged = function logged(token, cb) {
  var headers = {'x-access-token': token};
  var options = {host: 'localhost', port: 3443, path: '/api/users/logged/', method: 'GET', headers: headers};
  steps.apiRequest(options, cb);
}

var logout = function logout(cb) {
  var options = {host: 'localhost', port: 3443, path: '/api/users/logout/', method: 'GET'};
  steps.apiRequest(options, cb);
}

var register = function register(username, password, admin, cb) {
  var postData = JSON.stringify({username: username, password: password, admin: admin});
  var headers = {'Content-Type': 'application/json', 'Content-Length': postData.length};
  var options = {host: 'localhost', port: 3443, path: '/api/users/register', method: 'POST', headers: headers};
  steps.apiRequestPost(options, postData, cb);
}

module.exports = {
  deleteAllUsers: deleteAllUsers,
  findUser: findUser,
  login: login,
  loginAsAdmin: loginAsAdmin,
  logged: logged,
  logout: logout,
  register: register
};
