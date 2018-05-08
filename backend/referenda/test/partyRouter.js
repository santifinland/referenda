const https = require('https');
const assert = require('assert');

var steps = require('./party-steps-library');


synchronize(steps);

feature('Party Router', function() {
  var parties = [];
  scenario('Get all available parties', function() {
    given('There are parties available at Referenda', function() {
    });
    when('I retrieve all parties', function() {
      parties = JSON.parse(steps.getAllParties());
    });
    then('all parties are retrieved', function() {
      assert.equal(parties.length, 13);
      assert.equal(parties.filter(({name}) => name === 'pp')[0].quota, 134);
      assert.equal(parties.filter(({name}) => name === 'cc')[0].quota, 100);
    });
  });

  var party = '';
  scenario('Get a single available party', function() {
    given('There are parties available at Referenda', function() {
    });
    when('I retrieve a single party identified by its name', function() {
      party = JSON.parse(steps.getParty('cc'));
    });
    then('the proper party is retrieved', function() {
      assert.equal(party.quota, 100);
    });
  });
});
