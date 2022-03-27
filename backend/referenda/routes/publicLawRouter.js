const express = require('express');
const bodyParser = require('body-parser');

const Laws = require('../models/laws');
const Users = require('../models/user');
const Votes = require('../models/votes');

const findVote = function findVote(law, user, callback) {
    console.log(law._id);
    console.log(user._id);
    Votes.findOne({"lawId": law._id, "userId": user._id}, function (err, singleVote) {
        if (err) callback(err, null);
        // If direct vote found
        if (singleVote) {
            console.log("Encontrado voto directo:");
            console.log(singleVote.vote);
            return callback(null, singleVote.vote);
            // If no direct vote found
        } else {
            console.log("No encontrado voto directo");
            // Check if user has delegated to a party
            console.log("Username: " + user.username);
            console.log("Delegated party: " + user.delegatedParty);
            console.log("Delegated user: " + user.delegatedUser);
            if ((user.delegatedParty != null) && (user.delegatedParty !== 'nd')) {
                console.log("El usuario ha delagado en un partido");
                // User has a party delegations. Checking type
                if (law.positiveParties.indexOf(user.delegatedParty) >= 0) return callback(null, 1);
                if (law.negativeParties.indexOf(user.delegatedParty) >= 0) return callback(null, 2);
                if (law.abstentionParties.indexOf(user.delegatedParty) >= 0) return callback(null, 3);
            } else if (user.delegatedUser != null) {
                console.log("El usuario ha delagado en otro usuario");
                return findVote(law, user.delegatedUser, callback);
            } else {
                console.log("El usuario no ha votado ni delagado");
                return callback(null, 0)
            }
        }
    });
};

const lawRouter = express.Router();
lawRouter.use(bodyParser.json());

lawRouter.route('/')
.get(function (req, res, next) {
    const today = new Date();
    if (req.query.results) {
        req.query.vote_end = {$lt: today};
        delete req.query.results;
    } else if (req.query.all) {
        req.query.vote_start = {$lt: today};
        delete req.query.all;
    } else {
        req.query.vote_start = {$lt: today};
        req.query.vote_end = {$gte: today};
    }
    Laws.find(req.query)
        .select('law_id, reviewed, law_type institution tier area headline slug short_description long_description link pub_date ' +
                 'vote_start vote_end positive negative abstention official_positive official_negative ' +
                 'official_abstention featured  positiveParties negativeParties abstentionParties -_id')
        .exec(function (err, law) {
        if (err) next(err);
        res.json(law);
    });
});

lawRouter.route('/latest')
.get(function (req, res, next) {
    const today = new Date();
    const lastMonth = new Date(today.setMonth(today.getMonth() - 2));
    //req.query.vote_start = {$gt: lastMonth};
    //req.query.vote_end = {$gte: today};
    //req.query.featured = {true};
    Laws.find({featured: true, vote_end: {$gte: today}})
        .select('law_id, reviewed, law_type institution tier area headline slug short_description link pub_date ' +
            'vote_start vote_end positive negative abstention official_positive official_negative ' +
            'official_abstention featured  positiveParties negativeParties abstentionParties -_id')
        .exec(function (err, law) {
            if (err) next(err);
            res.json(law);
        });
});

lawRouter.route('/ley/:slug')
.get(function (req, res, next) {
    Laws.findOne({"slug": req.params.slug})
        .select('law_id reviewed law_type institution tier area featured headline slug short_description long_description ' +
                 'link pub_date vote_start vote_end positive negative abstention official_positive official_negative ' +
                 'official_abstention positiveParties negativeParties abstentionParties ' +
                 'comments -_id')
        .populate('comments.postedBy', '-admin -_id -__v -delegatedUser -delegatedParty')
        .exec(function (err, law) {
        if (err) return next(err);
        if (law) {
            res.json(law);
        } else {
            res.status(404).end();
        }
    });
});

lawRouter.route('/ley/:slug/comments')
.get(function (req, res, next) {
    Laws.findOne({"slug": req.params.slug})
        .populate('comments.postedBy', '-admin -_id -__v')
        .exec(function (err, law) {
        if (err) return next(err);
        if (law) {
            res.json(law.comments);
        } else {
            res.status(404).end();
        }
    });
});

module.exports = lawRouter;