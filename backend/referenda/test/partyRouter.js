const https = require('https');
const assert = require('assert');

var steps = require('./party-steps-library');
var userSteps = require('./user-steps-library');


synchronize(steps);
synchronize(userSteps);

feature('Party Router', function() {

  var parties = [];
  var username = '';
  var password = '';
  var token = '';

  scenario('Delete all parties', function() {
    given('There are parties available at Referenda', function() {
      username = 'admin';
      password = '1234';
      res = JSON.parse(userSteps.login(username, password));
      console.log(res);
      console.log(res.token);
      token = res.token;
      steps.postParty(token, 'Nuevo partido');
    });
    when('I delete all parties', function() {
      steps.deleteAllParties(res.token);
    });
    then('all parties are deleted', function() {
      parties = JSON.parse(steps.getAllParties());
      assert.equal(parties.length, 0);
    });
  });

  scenario('Get all available parties', function() {
    given('There are no parties available at Referenda', function() {
      username = 'admin';
      password = '1234';
      res = JSON.parse(userSteps.login(username, password));
      console.log(res);
      console.log(res.token);
      token = res.token;
      steps.deleteAllParties(res.token);
    });
    when('I retrieve all parties', function() {
      parties = JSON.parse(steps.getAllParties());
    });
    then('all parties are retrieved', function() {
      assert.equal(parties.length, 0);
    });
  });

  scenario('Create a party', function() {
    given('I am a Referenda admin', function() {
      username = 'admin';
      password = '1234';
      res = JSON.parse(userSteps.login(username, password));
      console.log(res);
      console.log(res.token);
      token = res.token;
    });
    when('I create a new party', function() {
      steps.postParty(token, 'Nuevo partido');
    });
    then('all parties are retrieved', function() {
      parties = JSON.parse(steps.getAllParties());
      assert.equal(parties.length, 1);
      assert.equal(parties.filter(({name}) => name === 'Nuevo partido')[0].quota, 23);
    });
  });

  scenario('Get all available parties', function() {
    given('There are parties available at Referenda', function() {
      username = 'admin';
      password = '1234';
      res = JSON.parse(userSteps.login(username, password));
      console.log(res);
      console.log(res.token);
      token = res.token;
      steps.postParty(token, 'Segundo');
    });
    when('I retrieve all parties', function() {
      parties = JSON.parse(steps.getAllParties());
    });
    then('all parties are retrieved', function() {
      assert.equal(parties.length, 2);
      assert.equal(parties.filter(({name}) => name === 'Nuevo partido')[0].quota, 23);
      assert.equal(parties.filter(({name}) => name === 'Segundo')[0].quota, 23);
    });
  });

  var party = '';
  scenario('Get a single available party', function() {
    given('There are parties available at Referenda', function() {
    });
    when('I retrieve a single party identified by its name', function() {
      party = JSON.parse(steps.getParty('Segundo'));
    });
    then('the proper party is retrieved', function() {
      assert.equal(party.quota, 23);
    });
  });
});
