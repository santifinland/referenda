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
      var admin = true;
      steps.register(username, password, admin);
    });
    then('A new user flagged as admin is created in Referenda', function() {
      //assert.equal(users.length, 1);
      res = JSON.parse(steps.login(username, password));
      console.log(res.token);
      assert.ok(res.token.length > 214);
    });
  });
});
