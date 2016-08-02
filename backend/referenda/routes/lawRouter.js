var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');


var Laws = require('../models/laws');

var lawRouter = express.Router();
lawRouter.use(bodyParser.json());

lawRouter.route('/')
.get(function (req, res, next) {
    Laws.find(req.query)
        .populate('comments.postedBy')
        .exec(function (err, law) {
        if (err) next(err);
        res.json(law);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Laws.create(req.body, function (err, law) {
        if (err) return next(err);
        console.log('law created!');
        var id = law._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end('Added the law with id: ' + id);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Laws.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

lawRouter.route('/:lawId')
.get(function (req, res, next) {
    Laws.findById(req.params.lawId)
        .populate('comments.postedBy')
        .exec(function (err, law) {
        if (err) return next(err);
        res.json(law);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Laws.findByIdAndUpdate(req.params.lawId, {
        $set: req.body
    }, {
        new: true
    }, function (err, law) {
        if (err) return next(err);
        res.json(law);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Laws.findByIdAndRemove(req.params.lawId, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

lawRouter.route('/:lawId/comments')

.get(function (req, res, next) {
    Laws.findById(req.params.lawId)
        .populate('comments.postedBy')
        .exec(function (err, law) {
        if (err) return next(err);
        res.json(law.comments);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findById(req.params.lawId, function (err, law) {
        if (err) return next(err);
        req.body.postedBy = req.decoded._id;
        law.comments.push(req.body);
        law.save(function (err, law) {
            if (err) return next(err);
            console.log('Updated Comments!');
            res.json(law);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Laws.findById(req.params.lawId, function (err, law) {
        if (err) return next(err);
        for (var i = (law.comments.length - 1); i >= 0; i--) {
            law.comments.id(law.comments[i]._id).remove();
        }
        law.save(function (err, result) {
            if (err) return next(err);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

lawRouter.route('/:lawId/votes')

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findById(req.params.lawId, function (err, law) {
        if (err) return next(err);
        console.log("En post de votes");
        console.log(req.body);
        console.log(req.body.vote);
        console.log(law.positive);
        // Find previous vote from same user
        Laws.find({"_id": req.params.lawId, "votes.votedBy": req.decoded._id}).exec(function (err, laws) {
            if (err) return next(err);
            if (!laws.length) {
                req.body.votedBy = req.decoded._id;
                law.votes.push(req.body);
                console.log(law.positive)
                if (req.body.vote == 1) {
                    console.log(law.positive);
                    law.positive = law.positive + 1;
                } else if (req.body.vote == 2) {
                    law.negative = law.negative + 1;
                } else {
                    law.abstention = law.abstention + 1;
                }
                law.save(function (err, law) {
                    if (err) return next(err);
                    console.log('Updated Votes!');
                    res.json(law);
                });
            } else {
                console.log("Has votado listo");
            }
        });
    });
});

lawRouter.route('/:lawId/comments/:commentId')

.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findById(req.params.lawId)
        .populate('comments.postedBy')
        .exec(function (err, law) {
        if (err) return next(err);
        res.json(law.comments.id(req.params.commentId));
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Laws.findById(req.params.lawId, function (err, law) {
        if (err) return next(err);
        law.comments.id(req.params.commentId).remove();
        req.body.postedBy = req.decoded._id;
        law.comments.push(req.body);
        law.save(function (err, law) {
            if (err) return next(err);
            console.log('Updated Comments!');
            res.json(law);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findById(req.params.lawId, function (err, law) {
        if (law.comments.id(req.params.commentId).postedBy
           != req.decoded._id) {
            var err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        law.comments.id(req.params.commentId).remove();
        law.save(function (err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });
});

module.exports = lawRouter;