var express = require('express');
var bodyParser = require('body-parser');
var Verify = require('./verify');

var Parties = require('../models/parties');

var partyRouter = express.Router();
partyRouter.use(bodyParser.json());

partyRouter.route('/')
.get(function (req, res, next) {
    Parties.find({}).select('name logo quota -_id')
        .exec(function (err, parties) {
        if (err) next(err);
        res.json(parties);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Parties.create(req.body, function (err, party) {
        if (err) return next(err);
        var id = party._id;
        res.status(201).end();
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  console.log(req);
  //if (err) {
    //console.log('Error when authorizing')
    //return next(err);
  //}
  Parties.remove({}, function (err, resp) {
    if (err) return next(err);
    if (resp) {
      console.log('All parties deleted')
      res.status(204).end();
    } else {
      console.log('Error deleting parties')
      res.status(404).end();
    }
  });
});

partyRouter.route('/:partyName')
.get(function (req, res, next) {
    Parties.findOne({"name": req.params.partyName}).select('name logo quota -_id')
        .exec(function (err, party) {
        if (err) return next(err);
        if (party) {
            res.json(party);
        } else {
            res.status(404).end();
        }
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Parties.findOneAndUpdate({"name": req.params.partyName}, {
        $set: req.body
    }, {
        new: false
    }, function (err, party) {
        if (err) return next(err);
        if (party) {
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Parties.findOneAndRemove({"name":req.params.partyName}, function (err, resp) {
        if (err) return next(err);
        if (resp) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    });
});

module.exports = partyRouter;