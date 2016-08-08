var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');


var Parties = require('../models/parties');

var partyRouter = express.Router();
partyRouter.use(bodyParser.json());

partyRouter.route('/')
.get(function (req, res, next) {
    Parties.find(req.query)
        .exec(function (err, party) {
        if (err) next(err);
        res.json(party);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Parties.create(req.body, function (err, party) {
        if (err) return next(err);
        console.log('party created!');
        var id = party._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end('Added the party with id: ' + id);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Parties.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

partyRouter.route('/:partyId')
.get(function (req, res, next) {
    Parties.findById(req.params.partyId)
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
        res.json(party);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Parties.findByIdAndRemove(req.params.partyId, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

module.exports = partyRouter;