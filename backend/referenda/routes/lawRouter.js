var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');


var Laws = require('../models/laws');
var Users = require('../models/user');
var Votes = require('../models/votes');
var CommentVotes = require('../models/commentVotes');

var lawRouter = express.Router();
lawRouter.use(bodyParser.json());

var pp = "57a07e50e120c6965b14bd9e"
var psoe = "57a0748d8bf653af576487ad"
var podemos = "57a1a6f105a802aa324fde80"
var ciudadanos = "57a6fbd4b2e70034539927b7"
var erc = "57a07e7fe120c6965b14bd9f"
var pnv = "57a6fc0bb2e70034539927b8"
var mixto = "57a07f47e120c6965b14bda0"

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
    // Search all users having delegated votes to each party
    Users.find({"delegatedParty": pp}, function (err, peperos) {
        if (err) return next(err);
        delegatedToPP = peperos.length;
        Users.find({"delegatedParty": psoe}, function (err, sociatas) {
            if (err) return next(err);
            delegatedToPsoe = sociatas.length;
            Users.find({"delegatedParty": podemos}, function (err, podemitas) {
                if (err) return next(err);
                delegatedToPodemos = podemitas.length;
                Users.find({"delegatedParty": pnv}, function (err, vascos) {
                    if (err) return next(err);
                    delegatedToPnv = vascos.length;
                    Users.find({"delegatedParty": erc}, function (err, catalanes) {
                        if (err) return next(err);
                        delegatedToErc = catalanes.length;
                        Users.find({"delegatedParty": ciudadanos}, function (err, naranjitos) {
                            if (err) return next(err);
                            delegatedToCiudadanos = naranjitos.length;
                            Users.find({"delegatedParty": mixto}, function (err, mixtos) {
                                if (err) return next(err);
                                delegatedToMixto = mixtos.length;
                                req.body.positiveParties = [];
                                req.body.negativeParties = [];
                                req.body.abstentionParties = [];
                                console.log(delegatedToPP);
                                console.log(delegatedToPsoe);
                                console.log(delegatedToPodemos);
                                console.log(delegatedToCiudadanos);
                                console.log(delegatedToErc);
                                console.log(delegatedToPnv);
                                console.log(delegatedToMixto);
                                // PP
                                if (req.body.pp == 1) {
                                    req.body.positive = delegatedToPP
                                    req.body.positiveParties.push(pp);
                                } else if (req.body.pp == 2) {
                                    req.body.negative = delegatedToPP
                                    req.body.negativeParties.push(pp);
                                } else {
                                    req.body.abstention = delegatedToPP
                                    req.body.abstentionParties.push(pp);
                                }
                                // Psoe
                                if (req.body.psoe == 1) {
                                    req.body.positive = req.body.positive + delegatedToPsoe
                                    req.body.positiveParties.push(psoe);
                                } else if (req.body.psoe == 2) {
                                    req.body.negative = req.body.negative + delegatedToPsoe
                                    req.body.negativeParties.push(psoe);
                                } else {
                                    req.body.abstention = req.body.abstention + delegatedToPsoe
                                    req.body.abstentionParties.push(psoe);
                                }
                                // Podemos
                                if (req.body.podemos == 1) {
                                    req.body.positive = req.body.positive + delegatedToPodemos
                                    req.body.positiveParties.push(podemos);
                                } else if (req.body.podemos == 2) {
                                    req.body.negative = req.body.negative + delegatedToPodemos
                                    req.body.negativeParties.push(podemos);
                                } else {
                                    req.body.abstention = req.body.abstention + delegatedToPodemos
                                    req.body.abstentionParties.push(podemos);
                                }
                                // Ciudadanos
                                if (req.body.ciudadanos == 1) {
                                    req.body.positive = req.body.positive + delegatedToCiudadanos
                                    req.body.positiveParties.push(ciudadanos);
                                } else if (req.body.ciudadanos == 2) {
                                    req.body.negative = req.body.negative + delegatedToCiudadanos
                                    req.body.negativeParties.push(ciudadanos);
                                } else {
                                    req.body.abstention = req.body.abstention + delegatedToCiudadanos
                                    req.body.abstentionParties.push(ciudadanos);
                                }
                                // Erc
                                if (req.body.erc == 1) {
                                    req.body.positive = req.body.positive + delegatedToErc
                                    req.body.positiveParties.push(erc);
                                } else if (req.body.erc == 2) {
                                    req.body.negative = req.body.negative + delegatedToErc
                                    req.body.negativeParties.push(erc);
                                } else {
                                    req.body.abstention = req.body.abstention + delegatedToErc
                                    req.body.abstentionParties.push(erc);
                                }
                                // Pnv
                                if (req.body.pnv == 1) {
                                    req.body.positive = req.body.positive + delegatedToPnv
                                    req.body.positiveParties.push(pnv);
                                } else if (req.body.pnv == 2) {
                                    req.body.negative = req.body.negative + delegatedToPnv
                                    req.body.negativeParties.push(pnv);
                                } else {
                                    req.body.abstention = req.body.abstention + delegatedToPnv
                                    req.body.abstentionParties.push(pnv);
                                }
                                // Mixto
                                if (req.body.mixto == 1) {
                                    req.body.positive = req.body.positive + delegatedToMixto
                                    req.body.positiveParties.push(mixto);
                                } else if (req.body.mixto == 2) {
                                    req.body.negative = req.body.negative + delegatedToMixto
                                    req.body.negativeParties.push(mixto);
                                } else {
                                    req.body.abstention = req.body.abstention + delegatedToMixto
                                    req.body.abstentionParties.push(mixto);
                                }
                                Laws.create(req.body, function (err, law) {
                                   if (err) return next(err);
                                   console.log('law created!');
                                   var id = law._id;
                                   res.writeHead(201, {
                                       'Content-Type': 'text/plain'
                                   });
                                   res.end('Added the law with id: ' + id);
                               });
                            });
                        });
                    });
                });
            });
        });
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
    // Count votes per type
    Votes.find({"lawId": req.params.lawId, "vote": 1}, {'userId':1, '_id':0}, function(err, positives) {
        if (err) return next(err);
        var positivers = [];
        for(var i = 0; i < positives.length; i++) {
            var obj = positives[i];
            console.log(obj.userId);
            positivers.push(obj.userId.replace(/[']/g, ""));
        }
        Votes.find({"lawId": req.params.lawId, "vote": 2}, {'userId':1, '_id':0}, function(err, negatives) {
            if (err) return next(err);
            var negativers = [];
            for(var i = 0; i < negatives.length; i++) {
                var obj = negatives[i];
                console.log(obj.userId);
                negativers.push(obj.userId);
            }
            Votes.find({"lawId": req.params.lawId, "vote": 3}, {'userId':1, '_id':0}, function(err, abstentiones) {
                if (err) return next(err);
                var abstentioners = [];
                for (var i = 0; i < abstentiones.length; i++) {
                    var obj = abstentiones[i];
                    console.log(obj.userId);
                    abstentioners.push(obj.userId);
                }
                console.log(abstentioners);
                console.log('Abstention votes are ' + abstentioners.length);
                // Find law
                Laws.findById(req.params.lawId, function (err, law) {
                    if (err) return next(err);
                    diff = function(a1, a2) {
                        var result = [];
                        for (var i = 0; i < a1.length; i++) {
                            a3 = a1[i].toString();
                            console.log(a3);
                            a4 = a3.replace(/'/g, "");
                            console.log(a4);
                            if (a2.indexOf(a4) == -1) {
                                console.log("not found");
                                result.push(a4);
                            }
                        }
                        return result;
                    };
                    // Search all users having delegated votes to each party
                    Users.find({"delegatedParty": pp}, function (err, peperos) {
                        if (err) return next(err);
                        var peperosIds = [];
                        for (var i = 0; i < peperos.length; i++) {
                            var obj = peperos[i];
                            console.log(obj.userId);
                            peperosIds.push(obj._id);
                        }
                        delegatedToPPYes = diff(peperosIds, positivers);
                        delegatedToPPNo = diff(delegatedToPPYes, negativers);
                        delegatedToPPAbs = diff(delegatedToPPNo, abstentioners);
                        delegatedToPP = delegatedToPPAbs.length;
                        Users.find({"delegatedParty": psoe}, function (err, sociatas) {
                            if (err) return next(err);
                            console.log("Numero de sociatas");
                            console.log(sociatas.length);
                            var sociatasIds = [];
                            for (var i = 0; i < sociatas.length; i++) {
                                var obj = sociatas[i];
                                console.log(obj.userId);
                                sociatasIds.push(obj._id);
                            }
                            delegatedToPsoeYes = diff(sociatasIds, positivers);
                            delegatedToPsoeNo = diff(delegatedToPsoeYes, negativers);
                            delegatedToPsoeAbs = diff(delegatedToPsoeNo, abstentioners);
                            delegatedToPsoe = delegatedToPsoeAbs.length;
                            Users.find({"delegatedParty": podemos}, function (err, podemitas) {
                                if (err) return next(err);
                                var podemitasIds = [];
                                for (var i = 0; i < podemitas.length; i++) {
                                    var obj = podemitas[i];
                                    console.log(obj.userId);
                                    podemitasIds.push(obj._id);
                                }
                                console.log("PodemitasIds");
                                console.log(podemitasIds);
                                console.log("Positivers");
                                console.log(positivers);
                                console.log("Negativers");
                                console.log(negativers);
                                console.log("abstentioners");
                                console.log(abstentioners);
                                console.log('YES');
                                delegatedToPodemosYes = diff(podemitasIds, positivers);
                                console.log(delegatedToPodemosYes);
                                console.log('No');
                                delegatedToPodemosNo = diff(delegatedToPodemosYes, negativers);
                                console.log(delegatedToPodemosNo);
                                console.log('Abs');
                                delegatedToPodemosAbs = diff(delegatedToPodemosNo, abstentioners);
                                console.log(delegatedToPodemosAbs);
                                delegatedToPodemos = delegatedToPodemosAbs.length;
                                Users.find({"delegatedParty": pnv}, function (err, vascos) {
                                    if (err) return next(err);
                                    var vascosIds = [];
                                    for (var i = 0; i < vascos.length; i++) {
                                        var obj = vascos[i];
                                        console.log(obj.userId);
                                        vascosIds.push(obj._id);
                                    }
                                    delegatedToPnvYes = diff(vascosIds, positivers);
                                    delegatedToPnvNo = diff(delegatedToPnvYes, negativers);
                                    delegatedToPnvAbs = diff(delegatedToPnvNo, abstentioners);
                                    delegatedToPnv = delegatedToPnvAbs.length;
                                    Users.find({"delegatedParty": erc}, function (err, catalanes) {
                                        if (err) return next(err);
                                        var catalanesIds = [];
                                        for (var i = 0; i < catalanes.length; i++) {
                                            var obj = catalanes[i];
                                            console.log(obj.userId);
                                            catalanesIds.push(obj._id);
                                        }
                                        delegatedToErcYes = diff(catalanesIds, positivers);
                                        delegatedToErcNo = diff(delegatedToErcYes, negativers);
                                        delegatedToErcAbs = diff(delegatedToErcNo, abstentioners);
                                        delegatedToErc = delegatedToErcAbs.length;
                                        Users.find({"delegatedParty": ciudadanos}, function (err, naranjitos) {
                                            if (err) return next(err);
                                            var naranjitosIds = [];
                                            for (var i = 0; i < naranjitos.length; i++) {
                                                var obj = naranjitos[i];
                                                console.log(obj.userId);
                                                naranjitosIds.push(obj._id);
                                            }
                                            delegatedToCiudadanosYes = diff(naranjitosIds, positivers);
                                            delegatedToCiudadanosNo = diff(delegatedToCiudadanosYes, negativers);
                                            delegatedToCiudadanosAbs = diff(delegatedToCiudadanosNo, abstentioners);
                                            delegatedToCiudadanos = delegatedToCiudadanosAbs.length;
                                            Users.find({"delegatedParty": mixto}, function (err, mixtos) {
                                                if (err) return next(err);
                                                var mixtosIds = [];
                                                for (var i = 0; i < mixtos.length; i++) {
                                                    var obj = mixtos[i];
                                                    console.log(obj.userId);
                                                    mixtosIds.push(obj._id);
                                                }
                                                delegatedToMixtoYes = diff(mixtosIds, positivers);
                                                delegatedToMixtoNo = diff(delegatedToMixtoYes, negativers);
                                                delegatedToMixtoAbs = diff(delegatedToMixtoNo, abstentioners);
                                                delegatedToMixto = delegatedToMixtoAbs.length;
                                                req.body.positiveParties = [];
                                                req.body.negativeParties = [];
                                                req.body.abstentionParties = [];
                                                req.body.positive = positivers.length;
                                                req.body.negative = negativers.length;
                                                req.body.abstention = abstentioners.length;
                                                console.log("delegatedToPP");
                                                console.log(delegatedToPP);
                                                console.log("delegatedToPsoe");
                                                console.log(delegatedToPsoe);
                                                console.log("delegatedToPodemos");
                                                console.log(delegatedToPodemos);
                                                console.log("delegatedToCiudadanos");
                                                console.log(delegatedToCiudadanos);
                                                console.log("delegatedToErc");
                                                console.log(delegatedToErc);
                                                console.log("delegatedToPnv");
                                                console.log(delegatedToPnv);
                                                console.log("delegatedToMixto");
                                                console.log(delegatedToMixto);
                                                // PP
                                                if (req.body.pp == 1) {
                                                    req.body.positive = req.body.positive + delegatedToPP
                                                    req.body.positiveParties.push(pp);
                                                } else if (req.body.pp == 2) {
                                                    req.body.negative = req.body.negative + delegatedToPP
                                                    req.body.negativeParties.push(pp);
                                                } else {
                                                    req.body.abstention = req.body.abstention + delegatedToPP
                                                    req.body.abstentionParties.push(pp);
                                                }
                                                // Psoe
                                                if (req.body.psoe == 1) {
                                                    req.body.positive = req.body.positive + delegatedToPsoe
                                                    req.body.positiveParties.push(psoe);
                                                } else if (req.body.psoe == 2) {
                                                    req.body.negative = req.body.negative + delegatedToPsoe
                                                    req.body.negativeParties.push(psoe);
                                                } else {
                                                    req.body.abstention = req.body.abstention + delegatedToPsoe
                                                    req.body.abstentionParties.push(psoe);
                                                }
                                                // Podemos
                                                if (req.body.podemos == 1) {
                                                    req.body.positive = req.body.positive + delegatedToPodemos
                                                    req.body.positiveParties.push(podemos);
                                                } else if (req.body.podemos == 2) {
                                                    req.body.negative = req.body.negative + delegatedToPodemos
                                                    req.body.negativeParties.push(podemos);
                                                } else {
                                                    req.body.abstention = req.body.abstention + delegatedToPodemos
                                                    req.body.abstentionParties.push(podemos);
                                                }
                                                // Ciudadanos
                                                if (req.body.ciudadanos == 1) {
                                                    req.body.positive = req.body.positive + delegatedToCiudadanos
                                                    req.body.positiveParties.push(ciudadanos);
                                                } else if (req.body.ciudadanos == 2) {
                                                    req.body.negative = req.body.negative + delegatedToCiudadanos
                                                    req.body.negativeParties.push(ciudadanos);
                                                } else {
                                                    req.body.abstention = req.body.abstention + delegatedToCiudadanos
                                                    req.body.abstentionParties.push(ciudadanos);
                                                }
                                                // Erc
                                                if (req.body.erc == 1) {
                                                    req.body.positive = req.body.positive + delegatedToErc
                                                    req.body.positiveParties.push(erc);
                                                } else if (req.body.erc == 2) {
                                                    req.body.negative = req.body.negative + delegatedToErc
                                                    req.body.negativeParties.push(erc);
                                                } else {
                                                    req.body.abstention = req.body.abstention + delegatedToErc
                                                    req.body.abstentionParties.push(erc);
                                                }
                                                // Pnv
                                                if (req.body.pnv == 1) {
                                                    req.body.positive = req.body.positive + delegatedToPnv
                                                    req.body.positiveParties.push(pnv);
                                                } else if (req.body.pnv == 2) {
                                                    req.body.negative = req.body.negative + delegatedToPnv
                                                    req.body.negativeParties.push(pnv);
                                                } else {
                                                    req.body.abstention = req.body.abstention + delegatedToPnv
                                                    req.body.abstentionParties.push(pnv);
                                                }
                                                // Mixto
                                                if (req.body.mixto == 1) {
                                                    req.body.positive = req.body.positive + delegatedToMixto
                                                    req.body.positiveParties.push(mixto);
                                                } else if (req.body.mixto == 2) {
                                                    req.body.negative = req.body.negative + delegatedToMixto
                                                    req.body.negativeParties.push(mixto);
                                                } else {
                                                    req.body.abstention = req.body.abstention + delegatedToMixto
                                                    req.body.abstentionParties.push(mixto);
                                                }

                                                // Update law
                                                console.log('Updating law');
                                                law.positive = req.body.positive;
                                                law.negative = req.body.negative;
                                                law.abstention = req.body.abstention;
                                                law.positiveParties = req.body.positiveParties;
                                                law.negativeParties = req.body.negativeParties;
                                                law.abstentionParties = req.body.abstentionParties;
                                                console.log(law.positive)
                                                console.log(law.negative)
                                                console.log(law.abstention)
                                                console.log(law.positiveParties)
                                                console.log(law.negativeParties)
                                                console.log(law.abstentionParties)
                                                law.save(function (err, l) {
                                                    if (err) return next(err);
                                                    console.log('Updated Law!');
                                                    res.json(l);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
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
        console.log(law.positive);
        // Find previous vote from same user
        Votes.find({"lawId": req.params.lawId, "userId": req.decoded._id}).exec(function (err, votes) {
            if (err) return next(err);
            console.log(votes.length);
            if (!votes.length) {
                //req.body.votedBy = req.decoded._id;
                //law.votes.push(req.body);
                // Find delegations and remove delegated vote in the law
                console.log("No previous vote found");
                Users.findById(req.decoded._id, function (err, user) {
                    if (err) return next(err);
                    console.log(user);
                    console.log("User delegation: " + user.delegatedParty)
                    if (law.positiveParties.indexOf(user.delegatedParty) != -1) {
                        law.positive = law.positive - 1;
                    }
                    console.log(law.negativeParties);
                    if (law.negativeParties.indexOf(user.delegatedParty) != -1) {
                        law.negative = law.negative - 1;
                    }
                    if (law.abstentionParties.indexOf(user.delegatedParty) != -1) {
                        law.abstention = law.abstention - 1;
                    }
                    // Create vote
                    console.log(req.body.vote);
                    var newVote = new Votes({"lawId": req.params.lawId, "userId": req.decoded._id, "vote": req.body.vote});
                    console.log(newVote);
                    newVote.save(function (err, v) {
                        if (err) return console.error(err);
                        console.log('Saved Vote!');
                    });
                    // Update law
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
                });
            } else {
                console.log("Previous vote found")
                lastVote = votes[0];
                console.log(lastVote);
                if (lastVote.vote == 1) {
                    console.log(law.positive);
                    law.positive = law.positive - 1;
                    console.log(law.positive);
                } else if(lastVote.vote == 2) {
                    law.negative = law.negative - 1;
                } else {
                    law.abstention = law.abstention - 1;
                }
                Votes.remove(lastVote, function(err, v) {
                    if (err) return next(err);
                    console.log('Remove last Vote');
                });
                // Create vote
                console.log(req.params.vote);
                var newVote = new Votes({"lawId": req.params.lawId, "userId": req.decoded._id, "vote": req.body.vote});
                console.log(newVote);
                newVote.save(function (err, v) {
                    if (err) return console.error(err);
                    console.log('Saved Vote!');
                });
                // Update law
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

lawRouter.route('/:lawId/comments/:commentId/votes')
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findById(req.params.lawId, function (err, law) {
        if (err) return next(err);
        console.log("En post de comment votes");
        // Find previous vote from same user
        CommentVotes.find({"lawId": req.params.lawId, "commentId": req.params.commentId,
            "userId": req.decoded._id}).exec(function (err, votes) {
            if (err) return next(err);
            console.log(votes.length);
            if (!votes.length) {
                console.log("No has votado todavia");
                Users.findById(req.decoded._id, function (err, user) {
                    if (err) return next(err);
                    console.log(user);
                    // Create vote
                    console.log(req.body.vote);
                    var newCommentVote = new CommentVotes({
                        "lawId": req.params.lawId,
                        "commentId": req.params.commentId,
                        "userId": req.decoded._id,
                         "vote": req.body.vote});
                    console.log(newCommentVote);
                    newCommentVote.save(function (err, v) {
                        if (err) return console.error(err);
                        console.log('Saved CommentVote!');
                    });
                    var comment = law.comments.id(req.params.commentId);
                    if (req.body.vote == 1) {
                        comment.positive = comment.positive + 1;
                    } else {
                        comment.negative = comment.negative + 1;
                    }
                    law.comments.id(req.params.commentId).remove();
                    law.comments.push(comment);
                    law.save(function (err, law) {
                        if (err) return next(err);
                        console.log('Updated Comments!');
                        res.json(law);
                    });
                });
            } else {
                console.log("Ya votaste");
            }
        });
    });
})

module.exports = lawRouter;