var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Parties = require('../models/parties');

var partyRouter = express.Router();
partyRouter.use(bodyParser.json());

partyRouter.route('/')
.get(function (req, res, next) {
    Parties.find(req.query).select('name logo quota')
        .exec(function (err, parties) {
        if (err) next(err);
        res.json(parties);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Parties.create(req.body, function (err, party) {
        if (err) return next(err);
        var id = party._id;
        res.status(201).json({"name": party.name, "logo": party.logo, "quota": party.quota});
    });
});

partyRouter.route('/:partyId')
.get(function (req, res, next) {
    Parties.findById(req.params.partyId).select('name logo quota')
        .exec(function (err, party) {
        if (err) return next(err);
        res.json(party);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Parties.findByIdAndUpdate(req.params.partyId, {
        $set: req.body
    }, {
        new: true
    }, function (err, party) {
        if (err) return next(err);
        res.json({"name": party.name, "logo": party.logo, "quota": party.quota});
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Parties.findByIdAndRemove(req.params.partyId, function (err, resp) {
        if (err) return next(err);
        res.status(204).end();
    });
});

module.exports = partyRouter;