var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');


var CommentVotes = require('../models/commentVotes');
var Laws = require('../models/laws');
var Users = require('../models/user');
var Votes = require('../models/votes');
var Parties = require('../models/parties');

var findVote = function findVote(law, user, callback) {
  console.log(law._id);
  console.log(user._id);
  Votes.findOne({"lawId": law._id, "userId": user._id}, function(err, singleVote) {
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
      if ((user.delegatedParty != null) && (user.delegatedParty != 'nd')) {
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
}

var updateVotes = function updateVotes(law, users, accPositive, accNegative, accAbstention, callback) {
  console.log("Users length: " + users.length);
  if (users.length > 0) {
    console.log("Mas de un usuario")
    Users.findById(users[0]._id, function (err, user) {
      if (err) return callback(err, null, null, null);
      console.log("Buscando voto del usuario: " + user.username)
      findVote(law, user, function(err, vote) {
        console.log("Encontrado voto del usuario: " + vote)
        if (err) return callback(err, null, null, null);
        users.shift();
        if (vote == 0) return updateVotes(law, users, accPositive, accNegative, accAbstention, callback);
        if (vote == 1) return updateVotes(law, users, accPositive + 1, accNegative, accAbstention, callback);
        if (vote == 2) return updateVotes(law, users, accPositive, accNegative + 1, accAbstention, callback);
        if (vote == 3) return updateVotes(law, users, accPositive, accNegative, accAbstention + 1, callback);
      });
    });
  } else {
    return callback(null, accPositive, accNegative, accAbstention);
  }
}

var lawRouter = express.Router();
lawRouter.use(bodyParser.json());

lawRouter.route('/')
.get(function (req, res, next) {
    var today = new Date();
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
        .select('law_type institution tier area headline slug short_description long_description link pub_date ' +
                 'vote_start vote_end positive negative abstention official_positive official_negative ' +
                 'official_abstention featured  positiveParties negativeParties abstentionParties -_id')
        .exec(function (err, law) {
        if (err) next(err);
        res.json(law);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  console.log(req.body);
  req.body.positiveParties = [];
  req.body.negativeParties = [];
  req.body.abstentionParties = [];
  // PP
  if (req.body.pp == 1) {
      req.body.positiveParties.push("pp");
  } else if (req.body.pp == 2) {
      req.body.negativeParties.push("pp");
  } else {
      req.body.abstentionParties.push("pp");
  }
  // Psoe
  if (req.body.psoe == 1) {
    req.body.positiveParties.push("psoe");
  } else if (req.body.psoe == 2) {
      req.body.negativeParties.push("psoe");
  } else {
      req.body.abstentionParties.push("psoe");
  }
  // Podemos
  if (req.body.podemos == 1) {
      req.body.positiveParties.push("podemos");
  } else if (req.body.podemos == 2) {
      req.body.negativeParties.push("podemos");
  } else {
      req.body.abstentionParties.push("podemos");
  }
  // Ciudadanos
  if (req.body.ciudadanos == 1) {
      req.body.positiveParties.push("ciudadanos");
  } else if (req.body.ciudadanos == 2) {
      req.body.negativeParties.push("ciudadanos");
  } else {
      req.body.abstentionParties.push("ciudadanos");
  }
  // Erc
  if (req.body.erc == 1) {
      req.body.positiveParties.push("erc");
  } else if (req.body.erc == 2) {
      req.body.negativeParties.push("erc");
  } else {
      req.body.abstentionParties.push("erc");
  }
  // Pnv
  if (req.body.pnv == 1) {
      req.body.positiveParties.push("pnv");
  } else if (req.body.pnv == 2) {
      req.body.negativeParties.push("pnv");
  } else {
      req.body.abstentionParties.push("pnv");
  }
  // Mas pais
  if (req.body.mp == 1) {
      req.body.positiveParties.push("mp");
  } else if (req.body.mp == 2) {
      req.body.negativeParties.push("mp");
  } else {
      req.body.abstentionParties.push("mp");
  }
  // Coalicion Canaria
  if (req.body.cc == 1) {
      req.body.positiveParties.push("cc");
  } else if (req.body.cc == 2) {
      req.body.negativeParties.push("cc");
  } else {
      req.body.abstentionParties.push("cc");
  }
  // Vox
  if (req.body.vox == 1) {
      req.body.positiveParties.push("vox");
  } else if (req.body.vox == 2) {
      req.body.negativeParties.push("vox");
  } else {
      req.body.abstentionParties.push("vox");
  }
  // Partido Regionalista Cantabro
  if (req.body.prc == 1) {
      req.body.positiveParties.push("prc");
  } else if (req.body.prc == 2) {
      req.body.negativeParties.push("prc");
  } else {
      req.body.abstentionParties.push("prc");
  }
  // Navarra suma
  if (req.body.upn == 1) {
      req.body.positiveParties.push("upn");
  } else if (req.body.upn == 2) {
      req.body.negativeParties.push("upn");
  } else {
      req.body.abstentionParties.push("upn");
  }
  // Bildu
  if (req.body.bildu == 1) {
      req.body.positiveParties.push("bildu");
  } else if (req.body.bildu == 2) {
      req.body.negativeParties.push("bildu");
  } else {
      req.body.abstentionParties.push("bildu");
  }
  // Junts per cat
  if (req.body.jpc == 1) {
      req.body.positiveParties.push("jpc");
  } else if (req.body.jpc == 2) {
      req.body.negativeParties.push("jpc");
  } else {
      req.body.abstentionParties.push("jpc");
  }
  // Teruel Existe
  if (req.body.te == 1) {
      req.body.positiveParties.push("te");
  } else if (req.body.te == 2) {
      req.body.negativeParties.push("te");
  } else {
      req.body.abstentionParties.push("te");
  }
  // CUP
  if (req.body.cup == 1) {
      req.body.positiveParties.push("cup");
  } else if (req.body.cup == 2) {
      req.body.negativeParties.push("cup");
  } else {
      req.body.abstentionParties.push("cup");
  }
  // BNG
  if (req.body.bng == 1) {
      req.body.positiveParties.push("bng");
  } else if (req.body.bng == 2) {
      req.body.negativeParties.push("bng");
  } else {
      req.body.abstentionParties.push("bng");
  }
  // No Delegar
  if (req.body.nd == 1) {
      req.body.positiveParties.push("nd");
  } else if (req.body.nd == 2) {
      req.body.negativeParties.push("nd");
  } else {
      req.body.abstentionParties.push("nd");
  }
  Laws.create(req.body, function (err, law) {
    if (err) return next(err);
    console.log('law created!');
    //res.status(201).json({"slug": law.slug});
    Users.find({}, function(err, users) {
      if (err) return next(err);
      updateVotes(law, users, 0, 0, 0, function(err, positiveVotes, negativeVotes, abstentionVotes) {
        if (err) return next(err);
        console.log("Numero de votos sí: " + positiveVotes);
        console.log("Numero de votos no: " + negativeVotes);
        console.log("Numero de votos abs: " + abstentionVotes);
        law.positive = positiveVotes;
        law.negative = negativeVotes;
        law.abstention = abstentionVotes;
        law.save(function (err, law) {
          if (err) return next(err);
          console.log('Updated Votes!');
          res.status(201).json({
            "positive": law.positive,
            "negative": law.negative,
            "abstention": law.abstention
          });
        });
      });
    });
  });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Laws.remove({}, function (err, resp) {
    if (err) return next(err);
    if (resp) {
      console.log('All laws deleted')
      res.status(204).end();
    } else {
      console.log('Error deleting laws')
      res.status(404).end();
    }
  });
});

lawRouter.route('/:slug')
.get(function (req, res, next) {
    Laws.findOne({"slug": req.params.slug})
        .select('law_type institution tier area featured headline slug short_description long_description ' +
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
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  Laws.findOne({"slug": req.params.slug}, function (err, law) {
    if (err) return next(err);
    law.law_type = req.body.law_type;
    law.institution = req.body.institution;
    law.tier = req.body.tier;
    law.area = req.body.area;
    law.headline = req.body.headline;
    law.slug = req.body.slug;
    law.short_description = req.body.short_description;
    law.long_description = req.body.long_description;
    law.link = req.body.link;
    law.pub_date = req.body.pub_date;
    law.vote_start = req.body.vote_start;
    law.vote_end = req.body.vote_end;
    law.positiveParties = req.body.positiveParties;
    law.negativeParties = req.body.negativeParties;
    law.abstentionParties = req.body.abstentionParties;
    law.official_positive = req.body.official_positive;
    law.official_negative = req.body.official_negative;
    law.official_abstention = req.body.official_abstention;
    Users.find({}, function(err, users) {
      if (err) return next(err);
      updateVotes(law, users, 0, 0, 0, function(err, positiveVotes, negativeVotes, abstentionVotes) {
        if (err) return next(err);
        console.log("Numero de votos sí: " + positiveVotes);
        console.log("Numero de votos no: " + negativeVotes);
        console.log("Numero de votos abs: " + abstentionVotes);
        law.positive = positiveVotes;
        law.negative = negativeVotes;
        law.abstention = abstentionVotes;
        law.save(function (err, law) {
          if (err) return next(err);
          console.log('Updated Votes!');
          res.status(200).json({
            "positive": law.positive,
            "negative": law.negative,
            "abstention": law.abstention
          });
        });
      });
    });
  });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Laws.findOne({"slug": req.params.slug}, function (err, law) {
        if (err) return next(err);
        if (law) {
            law.remove(function (err, remove_res) {
                if (err) return next(err);
                res.status(204).end();
            });
        } else {
            res.status(404).end();
        }
    });
});

lawRouter.route('/:slug/comments')
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
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findOne({"slug": req.params.slug}, function (err, law) {
        if (law) {
            if (err) return next(err);
            law.comments.push({"comment": req.body.comment, "postedBy": req.decoded._id});
            law.save(function (err, law) {
                if (err) return next(err);
                console.log('Updated Comments!');
                res.status(201).end();
            });
        } else {
            res.status(404).end();
        }
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Laws.findOne({"slug": req.params.slug}, function (err, law) {
        if (law) {
            if (err) return next(err);
            for (var i = (law.comments.length - 1); i >= 0; i--) {
                law.comments.id(law.comments[i]._id).remove();
            }
            law.save(function (err, result) {
                if (err) return next(err);
                res.status(204).end();
            });
        } else {
            res.status(404).end();
        }
    });
});

lawRouter.route('/:slug/votes')
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    if (req.body.vote < 1 || req.body.vote > 3) {
        res.status(400).json({"Reason": "Vote out of bounds: 1-3"});
    } else {
      console.log(req.body);
      Laws.findOne({"slug": req.params.slug}, function (err, law) {
        if (err) return next(err);
        var today = new Date();
        if (law) {
          if (law.vote_end < today) {
             res.status(405).json({"Reason": "Votes no longer allowed for this law"});
          } else {
            console.log("En post de votes");
            console.log(req.body);
            console.log(law.positive);
            // Find previous vote from same user
            Votes.find({"lawId": law._id, "userId": req.decoded._id}).exec(function (err, votes) {
              if (err) return next(err);
              console.log(votes.length);
              if (!votes.length) {
                console.log("No previous vote found");
                // Create vote
                var newVote = new Votes({"lawId": law._id, "userId": req.decoded._id, "vote": req.body.vote});
                newVote.save(function (err, v) {
                  if (err) return next(err);
                  // Update law
                  Users.find({}, function(err, users) {
                    if (err) return next(err);
                    updateVotes(law, users, 0, 0, 0, function(err, positiveVotes, negativeVotes, abstentionVotes) {
                      if (err) return next(err);
                      law.positive = positiveVotes;
                      law.negative = negativeVotes;
                      law.abstention = abstentionVotes;
                      law.save(function (err, law) {
                        if (err) return next(err);
                        res.status(201).json({
                          "positive": law.positive,
                          "negative": law.negative,
                          "abstention": law.abstention
                        });
                      });
                    });
                  });
                });
              } else {
                console.log("Previous vote found")
                lastVote = votes[0];
                console.log(lastVote);
                Votes.remove(lastVote, function(err, v) {
                  if (err) return next(err);
                  console.log('Remove last Vote');
                  // Create vote
                  var newVote = new Votes({"lawId": law._id, "userId": req.decoded._id, "vote": req.body.vote});
                  console.log(newVote);
                  newVote.save(function (err, v) {
                    if (err) return console.error(err);
                    console.log('Saved Vote!');
                    Users.find({}, function(err, users) {
                      if (err) return next(err);
                      updateVotes(law, users, 0, 0, 0, function(err, positiveVotes, negativeVotes, abstentionVotes) {
                        if (err) return next(err);
                        console.log("Numero de votos sí: " + positiveVotes);
                        console.log("Numero de votos no: " + negativeVotes);
                        console.log("Numero de votos abs: " + abstentionVotes);
                        law.positive = positiveVotes;
                        law.negative = negativeVotes;
                        law.abstention = abstentionVotes;
                        law.save(function (err, law) {
                          if (err) return next(err);
                          console.log('Updated Votes!');
                          res.status(201).json({
                            "positive": law.positive,
                            "negative": law.negative,
                            "abstention": law.abstention
                          });
                        });
                      });
                    });
                  });
                });
              }
            });
          }
        } else {
            res.status(404).end();
        }
      });
    }
});

lawRouter.route('/:slug/comments/:commentId')

.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findOne({"slug": req.params.slug})
        .populate('comments.postedBy', '-admin -_id -__v')
        .exec(function (err, law) {
        if (err) return next(err);
        if (law) {
            res.json(law.comments.id(req.params.commentId));
        } else {
            res.status(404).end();
        }
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Laws.findOne({"slug": req.params.slug}, function (err, law) {
        if (err) return next(err);
        if (law) {
            if (law.comments.id(req.params.commentId)) {
                if (law.comments.id(req.params.commentId).postedBy == req.decoded._id) {
                    law.comments.id(req.params.commentId).comment = req.body.comment;
                    law.save(function (err, law) {
                        if (err) return next(err);
                        console.log('Updated Comments!');
                        res.status(200).end();
                    });
                } else {
                    res.status(403).end();
                }
            } else {
                res.status(404).end();
            }
        } else {
            res.status(404).end();
        }
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Laws.findOne({"slug": req.params.slug}, function (err, law) {
        if (err) return next(err);
        if (law) {
            if (law.comments.id(req.params.commentId)) {
                law.comments.id(req.params.commentId).remove();
                law.save(function (err, resp) {
                    if (err) return next(err);
                    res.status(204).end();
                });
            } else {
                res.status(404).end();
            }
        } else {
            res.status(404).end();
        }
    });
});

lawRouter.route('/:slug/comments/:commentId/votes')
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findOne({"slug": req.params.slug})
        .exec(function (err, law) {
        if (err) return next(err);
        if (law) {
          console.log("En post de comment votes");
          // Check if comment exists
          if (law.comments.id(req.params.commentId)) {
              // Find previous vote from same user
              CommentVotes.find({"lawId": law._id, "commentId": req.params.commentId,
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
                            "lawId": law._id,
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
                            res.status(201).end();
                        });
                    });
                } else {
                    console.log("Ya votaste");
                }
              });
          } else {
              res.status(404).end();
          }
        } else {
          res.status(404).end();
        }
    });
})

module.exports = lawRouter;