const https = require('https');
const assert = require('assert');

var steps = require('./user-steps-library');
var partySteps = require('./party-steps-library');


synchronize(steps);
synchronize(partySteps);

feature('Users', function() {

  var username = '';
  var password = '';

  beforeFeature(function() {
    username = 'admin';
    password = '1234';
    res = JSON.parse(steps.login(username, password));
    if (!res.err) {
      steps.deleteAllUsers(res.token);
      partySteps.deleteAllParties(res.token);
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

  scenario('User logout', function() {
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

  scenario('Party vote delegation', function() {
    var token = '';
    var partyName = 'PartyDelegating'
    given('As a logged in Referenda user', function() {
      username = 'user';
      password = 'pass';
      steps.login(username, password);
      token = JSON.parse(steps.login(username, password)).token;
      res = steps.logged(token);
      console.log(res);
    });
    and('A political party', function() {
      adminToken = JSON.parse(steps.loginAsAdmin()).token;
      partySteps.postParty(adminToken, partyName);
    });
    when('I delegate my vote to that party', function() {
      steps.delegateParty(token, partyName);
    });
    then('My votes are delegated to that political party', function() {
      party = JSON.parse(steps.delegatedParty(token));
      assert.equal(party.name, partyName);
    });
  });

  scenario('User vote delegation', function() {
    var token = '';
    var anotherUsername = 'anotherUser';
    given('As a logged in Referenda user', function() {
      username = 'user';
      password = 'pass';
      token = JSON.parse(steps.login(username, password)).token;
    });
    and('Another Referenda user', function() {
      steps.register(anotherUsername, '1234', admin = false);
    });
    when('I delegate my vote to that user', function() {
      steps.delegateUser(token, anotherUsername);
    });
    then('My votes are delegated to that another user', function() {
      assert.equal(JSON.parse(steps.delegatedUser(token)).username, anotherUsername);
    });
    and('My votes are no longer delegated to any party', function() {
      assert.equal(steps.delegatedParty(token), 'null');
    });
  });
});
