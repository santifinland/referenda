const https = require('https');
const assert = require('assert');

var steps = require('./user-steps-library');


synchronize(steps);

feature('Users', function() {

  var username = '';
  var password = '';

  beforeFeature(function() {
    username = 'admin';
    password = '1234';
    res = JSON.parse(steps.login(username, password));
    if (!res.err) {
      steps.deleteAllUsers(res.token);
    }
  });

  scenario('Register a new user as an admin', function() {
    given('I have a username password pair', function() {
      username = 'admin';
      password = '1234';
    });
    when('I register in Referenda as an admin', function() {
      steps.register(username, password, admin = true);
    });
    then('A new user flagged as admin is created in Referenda', function() {
      res = JSON.parse(steps.login(username, password));
      assert.ok(res.token.length > 214);
    });
  });

  scenario('Register and login with a new normal (not admin) user', function() {
    given('I have a username password pair', function() {
      username = 'user';
      password = 'pass';
    });
    when('I register in Referenda as a normal user', function() {
      steps.register(username, password, admin = false);
    });
    then('A new user flagged as normal user is created in Referenda', function() {
      res = JSON.parse(steps.login(username, password));
      assert.ok(res.token.length > 214);
    });
  });

  scenario(' User logout', function() {
  var token = '';
    given('As a logged in Referenda user', function() {
      username = 'user';
      password = 'pass';
      steps.login(username, password);
      token = JSON.parse(steps.login(username, password)).token;
      res = steps.logged(token);
      console.log(res);
    });
    when('I log out from Referenda', function() {
      res = JSON.parse(steps.logout());
      console.log(res);
    });
    then('I am no longer logged at Referenda', function() {
      res = steps.logged(token);
      console.log(res);
    });
  });





});
