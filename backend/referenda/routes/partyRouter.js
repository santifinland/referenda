var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
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
});

partyRouter.route('/:partyName')
.get(function (req, res, next) {
    Parties.findOne({"name": req.params.partyName}).select('name logo quota -_id')
        .exec(function (err, party) {
        if (err) return next(err);
        res.json(party);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Parties.findOneAndUpdate({"name": req.params.partyName}, {
        $set: req.body
    }, {
        new: false
    }, function (err, party) {
        if (err) return next(err);
        res.status(200).end();
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Parties.findOneAndRemove({"name":req.params.partyName}, function (err, resp) {
        if (err) return next(err);
        res.status(204).end();
    });
});

module.exports = partyRouter;