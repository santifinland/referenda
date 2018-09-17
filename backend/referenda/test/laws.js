const https = require('https');
const assert = require('assert');

var steps = require('./law-steps-library');
var partySteps = require('./party-steps-library');
var userSteps = require('./user-steps-library');

synchronize(steps);
synchronize(partySteps);
synchronize(userSteps);


feature('Laws', function() {

  var law = {
    law_type: "Ley de tes",
    institution: "test",
    tier: 1,
    headline: "Ley de test",
    short_description: "Short descripcion de test",
    long_description: "Descripcion larga de la ley de test",
    link: "http://referenda.es",
    pub_date: "2018-01-01T00:00:00Z",
    vote_start: "2018-01-01T00:00:00Z",
    vote_end: "2118-01-01T00:00:00Z",
    positive: 0,
    negative: 0,
    abstention: 0,
    official_positive: 0,
    official_negative: 0,
    official_abstention: 0,
    pp: 2,
    psoe: 1,
    podemos: 1,
    ciudadanos: 2,
    erc: 1,
    pnv: 1,
    cc: 2,
    nc: 1,
    nd: 3,
    compromis: 1,
    fa: 1,
    upn: 2,
    bildu: 1,
    pdcat: 2
  }
  var slug = "ley-de-test"

  beforeFeature(function() {
    adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
    steps.deleteAllLaws(adminToken);
    partySteps.deleteAllParties(adminToken);
    userSteps.deleteAllUsers(adminToken);
    username = 'admin';
    password = '1234';
    userSteps.register(username, password, admin = true);
    adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
    username = 'user';
    password = 'pass';
    userSteps.register(username, password, admin = false);
    partySteps.postParty(adminToken, 'pp');
    partySteps.postParty(adminToken, 'psoe');
    partySteps.postParty(adminToken, 'podemos');
    partySteps.postParty(adminToken, 'ciudadanos');
    partySteps.postParty(adminToken, 'erc');
    partySteps.postParty(adminToken, 'pnv');
    partySteps.postParty(adminToken, 'cc');
    partySteps.postParty(adminToken, 'nc');
    partySteps.postParty(adminToken, 'compromis');
    partySteps.postParty(adminToken, 'fa');
    partySteps.postParty(adminToken, 'upn');
    partySteps.postParty(adminToken, 'bildu');
    partySteps.postParty(adminToken, 'nd');
  });

  scenario('Get all laws', function() {
    given('As an anonymous Referenda user', function() {
    });
    and('A Referenda law', function() {
      token = JSON.parse(userSteps.loginAsAdmin()).token;
      steps.postLaw(token, law);
    });
    when('I get all available laws', function() {
      res = JSON.parse(steps.getAllLaws());
    });
    then('all laws are retrieved', function() {
      assert.equal(res.length, 1);
    });
  });

  var dataset = [
    {desc: 'seconding party',  partyName: 'nc',         positive: 1, negative: 0, abstention: 0},
    {desc: 'against party',    partyName: 'ciudadanos', positive: 0, negative: 1, abstention: 0},
    {desc: 'abstention party', partyName: 'nd',         positive: 0, negative: 0, abstention: 1}
  ];
  scenario('Create a law when a Referenda user have delegated votes to a party', dataset, function(variant) {
    given('A Referenda user with votes delegated to a party', function() {
      adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
      steps.deleteAllLaws(adminToken);
      partySteps.postParty(adminToken, variant.partyName);
      username = 'user';
      password = 'pass';
      token = JSON.parse(userSteps.login(username, password)).token;
      userSteps.delegateParty(token, variant.partyName);
    });
    and('A Referenda law seconded by that party', function() {
      steps.postLaw(adminToken, law);
    });
    when('I get the law', function() {
      res = JSON.parse(steps.getLaw(slug));
    });
    then('laws votes are modified following user party delegated votes', function() {
      assert.equal(res.positive, variant.positive);
      assert.equal(res.negative, variant.negative);
      assert.equal(res.abstention, variant.abstention);
    });
  });

  var dataset = [
    {desc: 'equal1',      party1: 'nc',  party2: 'pp',  positive: 1, negative: 1, abstention: 0},
    {desc: 'equal2',      party1: 'pp',  party2: 'nc',  positive: 1, negative: 1, abstention: 0},
    {desc: 'seconding1',  party1: 'fa',  party2: 'fa',  positive: 2, negative: 0, abstention: 0},
    {desc: 'seconding2',  party1: 'erc', party2: 'pnv', positive: 2, negative: 0, abstention: 0},
    {desc: 'against1',    party1: 'pp',  party2: 'cc',  positive: 0, negative: 2, abstention: 0},
    {desc: 'against2',    party1: 'upn', party2: 'cc',  positive: 0, negative: 2, abstention: 0},
    {desc: 'abstention1', party1: 'nd',  party2: 'cc',  positive: 0, negative: 1, abstention: 1},
    {desc: 'abstention2', party1: 'fa',  party2: 'nd',  positive: 1, negative: 0, abstention: 1}
  ];
  scenario('Create a law when multiple Referenda users have delegated votes to parties', dataset, function(variant) {
    given('Multiple Referenda users with votes delegated to parties with different positions for that law', function() {
      adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
      partySteps.postParty(adminToken, variant.party1);
      partySteps.postParty(adminToken, variant.party2);

      username = 'user';
      password = 'pass';
      token = JSON.parse(userSteps.login(username, password)).token;
      userSteps.delegateParty(token, variant.party1);

      anotherUsername = 'anotherUser';
      userSteps.register(anotherUsername, '1234', admin = false);
      token = JSON.parse(userSteps.login(anotherUsername, '1234')).token;
      userSteps.delegateParty(token, variant.party2);
    });
    and('A Referenda law', function() {
      steps.deleteAllLaws(adminToken);
      steps.postLaw(adminToken, law);
    });
    when('I get the law', function() {
      res = JSON.parse(steps.getLaw(slug));
    });
    then('laws votes are modified following user party delegated votes', function() {
      assert.equal(res.positive, variant.positive);
      assert.equal(res.negative, variant.negative);
      assert.equal(res.abstention, variant.abstention);
    });
  });

  var dataset = [
    {desc: 'seconding party',  partyName: 'nc',         positive: 1, negative: 0, abstention: 0},
    {desc: 'against party',    partyName: 'ciudadanos', positive: 0, negative: 1, abstention: 0},
    {desc: 'abstention party', partyName: 'nd',         positive: 0, negative: 0, abstention: 1}
  ];
  scenario('Create a law before a Referenda user have delegated votes to a party', dataset, function(variant) {
    given('A Referenda law', function() {
      adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
      steps.deleteAllLaws(adminToken);
      userSteps.deleteAllUsers(adminToken);
      username = 'admin';
      password = '1234';
      userSteps.register(username, password, admin = true);
      adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
      steps.postLaw(adminToken, law);
    });
    and('A Referenda user with votes delegated to a party', function() {
      username = 'user';
      password = 'pass';
      userSteps.register(username, password, admin = false);
      token = JSON.parse(userSteps.login(username, password)).token;
      userSteps.delegateParty(token, variant.partyName);
    });
    when('I get the law', function() {
      steps.putLaw(adminToken, slug);
      res = JSON.parse(steps.getLaw(slug));
    });
    then('laws votes are modified following user party delegated votes', function() {
      assert.equal(res.positive, variant.positive);
      assert.equal(res.negative, variant.negative);
      assert.equal(res.abstention, variant.abstention);
    });
  });

  var dataset = [
    {desc: 'seconding party', partyName: 'psoe', positive: 1, negative: 0, abstention: 0}
  ];
  scenario('Modify a law', dataset, function(variant) {
    given('A Referenda law', function() {
      adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
      steps.deleteAllLaws(adminToken);
      userSteps.deleteAllUsers(adminToken);
      username = 'admin';
      password = '1234';
      userSteps.register(username, password, admin = true);
      adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
      username = 'user';
      password = 'pass';
      userSteps.register(username, password, admin = false);
      steps.postLaw(adminToken, law);
    });
    and('A Referenda user with votes delegated to a party', function() {
      partySteps.postParty(adminToken, variant.partyName);
      username = 'user';
      password = 'pass';
      token = JSON.parse(userSteps.login(username, password)).token;
      userSteps.delegateParty(token, variant.partyName);
    });
    when('I modify the law', function() {
      steps.putLaw(adminToken, slug);
    });
    then('laws votes are modified following user party delegated votes', function() {
      res = JSON.parse(steps.getLaw(slug));
      assert.equal(res.positive, variant.positive);
      assert.equal(res.negative, variant.negative);
      assert.equal(res.abstention, variant.abstention);
    });
  });

  scenario('Delete a law', function() {
      given('A Referenda law', function() {
        adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
        steps.deleteAllLaws(adminToken);
        userSteps.deleteAllUsers(adminToken);
        username = 'admin';
        password = '1234';
        userSteps.register(username, password, admin = true);
        adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
        steps.postLaw(adminToken, law);
      });
      when('I delete the law', function() {
        steps.deleteLaw(adminToken, slug);
      });
      then('law is properly deleted', function() {
        res = JSON.parse(steps.getAllLaws());
        assert.equal(res.length, 0);
      });
    });

  var dataset = [
    {desc: 'positive vote', vote: 1, positive: 1, negative: 0, abstention: 0},
    {desc: 'negative vote', vote: 2, positive: 0, negative: 1, abstention: 0},
    {desc: 'abstention vote', vote: 3, positive: 0, negative: 0, abstention: 1},
  ];
  scenario('Vote a law', dataset, function(variant) {
      given('A Referenda law', function() {
        adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
        steps.deleteAllLaws(adminToken);
        userSteps.deleteAllUsers(adminToken);
        username = 'admin';
        password = '1234';
        userSteps.register(username, password, admin = true);
        adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
        steps.postLaw(adminToken, law);
      });
      and('A Referenda user with no delegation to party nor other user', function() {
        username = 'user';
        password = 'pass';
        userSteps.register(username, password, admin = false);
        token = JSON.parse(userSteps.login(username, password)).token;
      });
      when('The user votes the law', function() {
        steps.postVote(adminToken, slug, variant.vote);
      });
      then('law votes are modified according to the user vote', function() {
        res = JSON.parse(steps.getLaw(slug));
        assert.equal(res.positive, variant.positive);
        assert.equal(res.negative, variant.negative);
        assert.equal(res.abstention, variant.abstention);
      });
    });

  var dataset = [
    {desc: 'seconding party',  partyName: 'nc',   vote: 1, positive: 1, negative: 0, abstention: 0},
    {desc: 'seconding party',  partyName: 'nc',   vote: 2, positive: 0, negative: 1, abstention: 0},
    {desc: 'seconding party',  partyName: 'nc',   vote: 3, positive: 0, negative: 0, abstention: 1},
    {desc: 'against party',    partyName: 'psoe', vote: 1, positive: 1, negative: 0, abstention: 0},
    {desc: 'against party',    partyName: 'psoe', vote: 2, positive: 0, negative: 1, abstention: 0},
    {desc: 'against party',    partyName: 'psoe', vote: 3, positive: 0, negative: 0, abstention: 1},
    {desc: 'abstention party', partyName: 'nd', vote: 1, positive: 1, negative: 0, abstention: 0},
    {desc: 'abstention party', partyName: 'nd', vote: 2, positive: 0, negative: 1, abstention: 0},
    {desc: 'abstention party', partyName: 'nd', vote: 3, positive: 0, negative: 0, abstention: 1}
  ];
  scenario.only('Vote an already created law before a Referenda user have delegated votes to a party', dataset, function(variant) {
    given('A Referenda law', function() {
      adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
      steps.deleteAllLaws(adminToken);
      userSteps.deleteAllUsers(adminToken);
      username = 'admin';
      password = '1234';
      userSteps.register(username, password, admin = true);
      adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
      username = 'user';
      password = 'pass';
      userSteps.register(username, password, admin = false);
      steps.postLaw(adminToken, law);
    });
    and('A Referenda user with votes delegated to a party', function() {
      username = 'user';
      password = 'pass';
      token = JSON.parse(userSteps.login(username, password)).token;
      userSteps.delegateParty(token, variant.partyName);
    });
    when('The user votes the law', function() {
      steps.postVote(token, slug, variant.vote);
    });
    then('laws votes are modified following user direct vote instead of party delegated votes', function() {
      res = JSON.parse(steps.getLaw(slug));
      assert.equal(res.positive, variant.positive);
      assert.equal(res.negative, variant.negative);
      assert.equal(res.abstention, variant.abstention);
    });
  });

  var dataset = [
    {desc: 'seconding party',  partyName: 'nc',   vote: 1, positive: 1, negative: 0, abstention: 0},
    {desc: 'seconding party',  partyName: 'nc',   vote: 2, positive: 0, negative: 1, abstention: 0},
    {desc: 'seconding party',  partyName: 'nc',   vote: 3, positive: 0, negative: 0, abstention: 1},
    {desc: 'against party',    partyName: 'psoe', vote: 1, positive: 1, negative: 0, abstention: 0},
    {desc: 'against party',    partyName: 'psoe', vote: 2, positive: 0, negative: 1, abstention: 0},
    {desc: 'against party',    partyName: 'psoe', vote: 3, positive: 0, negative: 0, abstention: 1},
    {desc: 'abstention party', partyName: 'nd', vote: 1, positive: 1, negative: 0, abstention: 0},
    {desc: 'abstention party', partyName: 'nd', vote: 2, positive: 0, negative: 1, abstention: 0},
    {desc: 'abstention party', partyName: 'nd', vote: 3, positive: 0, negative: 0, abstention: 1}
  ];
  scenario('Vote an already created law after a Referenda user have delegated votes to a party', dataset, function(variant) {
    given('A Referenda user with votes delegated to a party', function() {
      adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
      steps.deleteAllLaws(adminToken);
      userSteps.deleteAllUsers(adminToken);
      username = 'admin';
      password = '1234';
      userSteps.register(username, password, admin = true);
      adminToken = JSON.parse(userSteps.loginAsAdmin()).token;
      username = 'user';
      password = 'pass';
      userSteps.register(username, password, admin = false);
      token = JSON.parse(userSteps.login(username, password)).token;
      userSteps.delegateParty(token, variant.partyName);
    });
    and('A Referenda law', function() {
      steps.postLaw(adminToken, law);
    });
    when('The user votes the law', function() {
      steps.postVote(token, slug, variant.vote);
    });
    then('laws votes are modified following user direct vote instead of party delegated votes', function() {
      res = JSON.parse(steps.getLaw(slug));
      assert.equal(res.positive, variant.positive);
      assert.equal(res.negative, variant.negative);
      assert.equal(res.abstention, variant.abstention);
    });
  });


});
