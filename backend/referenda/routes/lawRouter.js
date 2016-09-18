var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');


var CommentVotes = require('../models/commentVotes');
var Laws = require('../models/laws');
var Users = require('../models/user');
var Votes = require('../models/votes');
var Parties = require('../models/parties');

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
    // Search all users having delegated votes to other users
    kk = function(us, acc, callback) {
        console.log("INICIO US");
        console.log(us);
        if (us.length > 0) {
            Users.find({"delegatedUser": us[0]._id}, function (err, delegando) {
                if (!delegando.length) {
                    us.shift();
                    return kk(us, acc, callback);
                } else {
                    console.log("ELSE delegando");
                    console.log(delegando);
                    acc = acc + delegando.length;
                    us.shift();
                    console.log("after shift us");
                    console.log(us);
                    new_us = us.concat(delegando);
                    console.log("after concat new_us");
                    console.log(new_us);
                    return kk(new_us, acc, callback);
                }
            });
        } else {
            return callback(null, acc);
        }
    }
    // Find ids of the parties
    Parties.find({}, function (err, p) {
      if (err) return next(err);
      console.log("PPP")
      parties = {};
      for (var i=0, l=p.length; i<l; i++ ) {
          console.log(p[i]._id);
          console.log(p[i].name);
          parties[p[i].name] = p[i]._id;
      }
      console.log(parties);
      // Search all users having delegated votes to each party
      Users.find({"delegatedParty": parties["pp"], "delegatedUser": null}, function (err, peperos) {
        if (err) return next(err);
        new_votes = kk(peperos, peperos.length, function(err, delegatedToPP) {
          if (err) return next(err);
          Users.find({"delegatedParty": parties["psoe"], "delegatedUser": null}, function (err, sociatas) {
            if (err) return next(err);
            new_votes = kk(sociatas, sociatas.length, function(err, delegatedToPsoe) {
              if (err) return next(err);
              Users.find({"delegatedParty": parties["podemos"], "delegatedUser": null}, function (err, podemitas) {
                if (err) return next(err);
                new_votes = kk(podemitas, podemitas.length, function(err, delegatedToPodemos) {
                  if (err) return next(err);
                  Users.find({"delegatedParty": parties["pnv"], "delegatedUser": null}, function (err, vascos) {
                    if (err) return next(err);
                    new_votes = kk(vascos, vascos.length, function(err, delegatedToPnv) {
                      if (err) return next(err);
                      Users.find({"delegatedParty": parties["erc"], "delegatedUser": null}, function (err, catalanes) {
                        if (err) return next(err);
                        new_votes = kk(catalanes, catalanes.length, function(err, delegatedToErc) {
                          if (err) return next(err);
                          Users.find({"delegatedParty": parties["ciudadanos"], "delegatedUser": null}, function (err, naranjitos) {
                            if (err) return next(err);
                            new_votes = kk(naranjitos, naranjitos.length, function(err, delegatedToCiudadanos) {
                              if (err) return next(err);
                              Users.find({"delegatedParty": parties["compromis"], "delegatedUser": null}, function (err, compromisos) {
                                if (err) return next(err);
                                new_votes = kk(compromisos, compromisos.length, function(err, delegatedToCompromis) {
                                  if (err) return next(err);
                                  Users.find({"delegatedParty": parties["cc"], "delegatedUser": null}, function (err, ccs) {
                                    if (err) return next(err);
                                    new_votes = kk(ccs, ccs.length, function(err, delegatedToCc) {
                                      if (err) return next(err);
                                      Users.find({"delegatedParty": parties["nc"], "delegatedUser": null}, function (err, ncs) {
                                        if (err) return next(err);
                                        new_votes = kk(ncs, ncs.length, function(err, delegatedToNc) {
                                          if (err) return next(err);
                                          Users.find({"delegatedParty": parties["fa"], "delegatedUser": null}, function (err, fas) {
                                            if (err) return next(err);
                                            new_votes = kk(fas, fas.length, function(err, delegatedToFa) {
                                              if (err) return next(err);
                                              Users.find({"delegatedParty": parties["upn"], "delegatedUser": null}, function (err, upns) {
                                                if (err) return next(err);
                                                new_votes = kk(upns, upns.length, function(err, delegatedToUpn) {
                                                  if (err) return next(err);
                                                  Users.find({"delegatedParty": parties["bildu"], "delegatedUser": null}, function (err, bildus) {
                                                    if (err) return next(err);
                                                    new_votes = kk(bildus, bildus.length, function(err, delegatedToBildu) {
                                                      if (err) return next(err);
                                                      Users.find({"delegatedParty": parties["nd"], "delegatedUser": null}, function (err, nds) {
                                                        if (err) return next(err);
                                                        new_votes = kk(nds, nds.length, function(err, delegatedToNd) {
                                                          if (err) return next(err);
                                                          req.body.positiveParties = [];
                                                          req.body.negativeParties = [];
                                                          req.body.abstentionParties = [];
                                                          console.log(delegatedToPP);
                                                          console.log(delegatedToPsoe);
                                                          console.log(delegatedToPodemos);
                                                          console.log(delegatedToCiudadanos);
                                                          console.log(delegatedToErc);
                                                          console.log(delegatedToPnv);
                                                          console.log(delegatedToCompromis);
                                                          console.log(delegatedToCc);
                                                          console.log(delegatedToNc);
                                                          console.log(delegatedToFa);
                                                          console.log(delegatedToUpn);
                                                          console.log(delegatedToBildu);
                                                          console.log(delegatedToNd);
                                                          // PP
                                                          if (req.body.pp == 1) {
                                                              req.body.positive = delegatedToPP
                                                              req.body.positiveParties.push(parties["pp"]);
                                                          } else if (req.body.pp == 2) {
                                                              req.body.negative = delegatedToPP
                                                              req.body.negativeParties.push(parties["pp"]);
                                                          } else {
                                                              req.body.abstention = delegatedToPP
                                                              req.body.abstentionParties.push(parties["pp"]);
                                                          }
                                                          // Psoe
                                                          if (req.body.psoe == 1) {
                                                            req.body.positive = req.body.positive + delegatedToPsoe
                                                            req.body.positiveParties.push(parties["psoe"]);
                                                          } else if (req.body.psoe == 2) {
                                                              req.body.negative = req.body.negative + delegatedToPsoe
                                                              req.body.negativeParties.push(parties["psoe"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToPsoe
                                                              req.body.abstentionParties.push(parties["psoe"]);
                                                          }
                                                          // Podemos
                                                          if (req.body.podemos == 1) {
                                                              req.body.positive = req.body.positive + delegatedToPodemos
                                                              req.body.positiveParties.push(parties["podemos"]);
                                                          } else if (req.body.podemos == 2) {
                                                              req.body.negative = req.body.negative + delegatedToPodemos
                                                              req.body.negativeParties.push(parties["podemos"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToPodemos
                                                              req.body.abstentionParties.push(parties["podemos"]);
                                                          }
                                                          // Ciudadanos
                                                          if (req.body.ciudadanos == 1) {
                                                              req.body.positive = req.body.positive + delegatedToCiudadanos
                                                              req.body.positiveParties.push(parties["ciudadanos"]);
                                                          } else if (req.body.ciudadanos == 2) {
                                                              req.body.negative = req.body.negative + delegatedToCiudadanos
                                                              req.body.negativeParties.push(parties["ciudadanos"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToCiudadanos
                                                              req.body.abstentionParties.push(parties["ciudadanos"]);
                                                          }
                                                          // Erc
                                                          if (req.body.erc == 1) {
                                                              req.body.positive = req.body.positive + delegatedToErc
                                                              req.body.positiveParties.push(parties["erc"]);
                                                          } else if (req.body.erc == 2) {
                                                              req.body.negative = req.body.negative + delegatedToErc
                                                              req.body.negativeParties.push(parties["erc"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToErc
                                                              req.body.abstentionParties.push(parties["erc"]);
                                                          }
                                                          // Pnv
                                                          if (req.body.pnv == 1) {
                                                              req.body.positive = req.body.positive + delegatedToPnv
                                                              req.body.positiveParties.push(parties["pnv"]);
                                                          } else if (req.body.pnv == 2) {
                                                              req.body.negative = req.body.negative + delegatedToPnv
                                                              req.body.negativeParties.push(parties["pnv"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToPnv
                                                              req.body.abstentionParties.push(parties["pnv"]);
                                                          }
                                                          // Compromis
                                                          if (req.body.compromis == 1) {
                                                              req.body.positive = req.body.positive + delegatedToCompromis
                                                              req.body.positiveParties.push(parties["compromis"]);
                                                          } else if (req.body.compromis == 2) {
                                                              req.body.negative = req.body.negative + delegatedToCompromis
                                                              req.body.negativeParties.push(parties["compromis"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToCompromis
                                                              req.body.abstentionParties.push(parties["compromis"]);
                                                          }
                                                          // Coalicion Canaria
                                                          if (req.body.cc == 1) {
                                                              req.body.positive = req.body.positive + delegatedToCc
                                                              req.body.positiveParties.push(parties["cc"]);
                                                          } else if (req.body.cc == 2) {
                                                              req.body.negative = req.body.negative + delegatedToCc
                                                              req.body.negativeParties.push(parties["cc"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToCc
                                                              req.body.abstentionParties.push(parties["cc"]);
                                                          }
                                                          // Nueva canaria
                                                          if (req.body.nc == 1) {
                                                              req.body.positive = req.body.positive + delegatedToNc
                                                              req.body.positiveParties.push(parties["nc"]);
                                                          } else if (req.body.nc == 2) {
                                                              req.body.negative = req.body.negative + delegatedToNc
                                                              req.body.negativeParties.push(parties["nc"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToNc
                                                              req.body.abstentionParties.push(parties["nc"]);
                                                          }
                                                          // Foro Asturias
                                                          if (req.body.fa == 1) {
                                                              req.body.positive = req.body.positive + delegatedToFa
                                                              req.body.positiveParties.push(parties["fa"]);
                                                          } else if (req.body.fa == 2) {
                                                              req.body.negative = req.body.negative + delegatedToFa
                                                              req.body.negativeParties.push(parties["fa"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToFa
                                                              req.body.abstentionParties.push(parties["fa"]);
                                                          }
                                                          // UPN
                                                          if (req.body.upn == 1) {
                                                              req.body.positive = req.body.positive + delegatedToUpn
                                                              req.body.positiveParties.push(parties["upn"]);
                                                          } else if (req.body.upn == 2) {
                                                              req.body.negative = req.body.negative + delegatedToUpn
                                                              req.body.negativeParties.push(parties["upn"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToUpn
                                                              req.body.abstentionParties.push(parties["upn"]);
                                                          }
                                                          // Bildu
                                                          if (req.body.bildu == 1) {
                                                              req.body.positive = req.body.positive + delegatedToBildu
                                                              req.body.positiveParties.push(parties["bildu"]);
                                                          } else if (req.body.bildu == 2) {
                                                              req.body.negative = req.body.negative + delegatedToBildu
                                                              req.body.negativeParties.push(parties["bildu"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToBildu
                                                              req.body.abstentionParties.push(parties["bildu"]);
                                                          }
                                                          // No Delegar
                                                          if (req.body.nd == 1) {
                                                              req.body.positive = req.body.positive + delegatedToNd
                                                              req.body.positiveParties.push(parties["nd"]);
                                                          } else if (req.body.nd == 2) {
                                                              req.body.negative = req.body.negative + delegatedToNd
                                                              req.body.negativeParties.push(parties["nd"]);
                                                          } else {
                                                              req.body.abstention = req.body.abstention + delegatedToNd
                                                              req.body.abstentionParties.push(parties["nd"]);
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
                  });
                });
              });
            });
          });
        });
      });
      console.log("ENDPPP")
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Laws.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

lawRouter.route('/:slug')
.get(function (req, res, next) {
    Laws.findOne({"slug": req.params.slug})
        .populate('comments.postedBy')
        .exec(function (err, law) {
        if (err) return next(err);
        res.json(law);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    // Search all users having delegated votes to other users
    kk = function(us, acc, callback) {
        if (us.length > 0) {
            Users.find({"delegatedUser": us[0]._id}, function (err, dele) {
                if (!dele.length) {
                    us.shift();
                    return kk(us, acc, callback);
                } else {
                    for (var i = 0; i < dele.length; i++) {
                        console.log("usernames");
                        console.log(dele[i].username);
                        acc.push(dele[i]._id);
                    }
                    us.shift();
                    new_us = us.concat(dele);
                    return kk(new_us, acc, callback);
                }
            });
        } else {
            return callback(null, acc);
        }
    }
    // Find ids of the parties
    Parties.find({}, function (err, p) {
      if (err) return next(err);
      console.log("PPP")
      parties = {};
      for (var i=0, l=p.length; i<l; i++ ) {
          console.log(p[i]._id);
          console.log(p[i].name);
          parties[p[i].name] = p[i]._id;
      }
      console.log(parties);
      // Count votes per type
      Laws.findOne({"slug": req.params.slug}, function (err, law) {
        if (err) return next(err);
        console.log(law);
        Votes.find({"lawId": law._id, "vote": 1}, {'userId':1, '_id':0}, function(err, positives) {
            if (err) return next(err);
            var positivers = [];
            for(var i = 0; i < positives.length; i++) {
                var obj = positives[i];
                console.log("=========");
                console.log(obj.userId);
                positivers.push(obj.userId.replace(/[']/g, ""));
            }
            Votes.find({"lawId": law._id, "vote": 2}, {'userId':1, '_id':0}, function(err, negatives) {
                if (err) return next(err);
                var negativers = [];
                for(var i = 0; i < negatives.length; i++) {
                    var obj = negatives[i];
                    console.log("********");
                    console.log(obj.userId);
                    negativers.push(obj.userId);
                }
                Votes.find({"lawId": law._id, "vote": 3}, {'userId':1, '_id':0}, function(err, abstentiones) {
                    if (err) return next(err);
                    var abstentioners = [];
                    for (var i = 0; i < abstentiones.length; i++) {
                        var obj = abstentiones[i];
                        console.log(obj.userId);
                        abstentioners.push(obj.userId);
                    }
                    console.log(abstentioners);
                    console.log('Abstention votes are ' + abstentioners.length);
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
                    }
                    // Search all users having delegated votes to each party
                    Users.find({"delegatedParty": parties["pp"]}, function (err, peperos) {
                        ty = []
                        for (var i = 0; i < peperos.length; i++) {
                            ty.push(peperos[i]._id);
                        }
                        kk(peperos, ty, function(err, peperosIds) {
                          if (err) return next(err);
                          delegatedToPPYes = diff(peperosIds, positivers);
                          delegatedToPPNo = diff(delegatedToPPYes, negativers);
                          delegatedToPPAbs = diff(delegatedToPPNo, abstentioners);
                          delegatedToPP = delegatedToPPAbs.length;
                          Users.find({"delegatedParty": parties["psoe"]}, function (err, sociatas) {
                            ty = []
                            for (var i = 0; i < sociatas.length; i++) {
                                ty.push(sociatas[i]._id);
                            }
                            kk(sociatas, ty, function(err, sociatasIds) {
                                if (err) return next(err);
                                delegatedToPsoeYes = diff(sociatasIds, positivers);
                                delegatedToPsoeNo = diff(delegatedToPsoeYes, negativers);
                                delegatedToPsoeAbs = diff(delegatedToPsoeNo, abstentioners);
                                delegatedToPsoe = delegatedToPsoeAbs.length;
                                Users.find({"delegatedParty": parties["podemos"]}, function (err, podemitas) {
                                  ty = []
                                  for (var i = 0; i < podemitas.length; i++) {
                                      ty.push(podemitas[i]._id);
                                  }
                                  kk(podemitas, ty, function(err, podemitasIds) {
                                    if (err) return next(err);
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
                                    Users.find({"delegatedParty": parties["pnv"]}, function (err, vascos) {
                                      ty = []
                                      for (var i = 0; i < vascos.length; i++) {
                                          ty.push(vascos[i]._id);
                                      }
                                      kk(vascos, ty, function(err,vascosIds) {
                                        if (err) return next(err);
                                        delegatedToPnvYes = diff(vascosIds, positivers);
                                        delegatedToPnvNo = diff(delegatedToPnvYes, negativers);
                                        delegatedToPnvAbs = diff(delegatedToPnvNo, abstentioners);
                                        delegatedToPnv = delegatedToPnvAbs.length;
                                        Users.find({"delegatedParty": parties["erc"]}, function (err, catalanes) {
                                          ty = []
                                          for (var i = 0; i < catalanes.length; i++) {
                                              ty.push(catalanes[i]._id);
                                          }
                                          kk(catalanes, ty, function(err,catalanesIds) {
                                            if (err) return next(err);
                                            delegatedToErcYes = diff(catalanesIds, positivers);
                                            delegatedToErcNo = diff(delegatedToErcYes, negativers);
                                            delegatedToErcAbs = diff(delegatedToErcNo, abstentioners);
                                            delegatedToErc = delegatedToErcAbs.length;

                                            Users.find({"delegatedParty": parties["ciudadanos"]}, function (err, naranjitos) {
                                              ty = []
                                              for (var i = 0; i < naranjitos.length; i++) {
                                                  ty.push(naranjitos[i]._id);
                                              }
                                              kk(naranjitos, ty, function(err,naranjitosIds) {
                                                if (err) return next(err);
                                                delegatedToCiudadanosYes = diff(naranjitosIds, positivers);
                                                delegatedToCiudadanosNo = diff(delegatedToCiudadanosYes, negativers);
                                                delegatedToCiudadanosAbs = diff(delegatedToCiudadanosNo, abstentioners);
                                                delegatedToCiudadanos = delegatedToCiudadanosAbs.length;

                                                Users.find({"delegatedParty": parties["cc"]}, function (err, ccs) {
                                                  ty = []
                                                  for (var i = 0; i < ccs.length; i++) {
                                                      ty.push(ccs[i]._id);
                                                  }
                                                  kk(ccs, ty, function(err, ccsIds) {
                                                    if (err) return next(err);
                                                    delegatedToCcYes = diff(ccsIds, positivers);
                                                    delegatedToCcNo = diff(delegatedToCcYes, negativers);
                                                    delegatedToCcAbs = diff(delegatedToCcNo, abstentioners);
                                                    delegatedToCc = delegatedToCcAbs.length;

                                                    Users.find({"delegatedParty": parties["nc"]}, function (err, ncs) {
                                                      ty = []
                                                      for (var i = 0; i < ncs.length; i++) {
                                                          ty.push(ncs[i]._id);
                                                      }
                                                      kk(ncs, ty, function(err, ncsIds) {
                                                        if (err) return next(err);
                                                        delegatedToNcYes = diff(ncsIds, positivers);
                                                        delegatedToNcNo = diff(delegatedToNcYes, negativers);
                                                        delegatedToNcAbs = diff(delegatedToNcNo, abstentioners);
                                                        delegatedToNc = delegatedToNcAbs.length;

                                                        Users.find({"delegatedParty": parties["compromis"]}, function (err, compromisos) {
                                                          ty = []
                                                          for (var i = 0; i < compromisos.length; i++) {
                                                              ty.push(compromisos[i]._id);
                                                          }
                                                          kk(compromisos, ty, function(err, compromisosIds) {
                                                            if (err) return next(err);
                                                            delegatedToCompromisYes = diff(compromisosIds, positivers);
                                                            delegatedToCompromisNo = diff(delegatedToCompromisYes, negativers);
                                                            delegatedToCompromisAbs = diff(delegatedToCompromisNo, abstentioners);
                                                            delegatedToCompromis = delegatedToCompromisAbs.length;

                                                            Users.find({"delegatedParty": parties["fa"]}, function (err, fas) {
                                                              ty = []
                                                              for (var i = 0; i < fas.length; i++) {
                                                                  ty.push(fas[i]._id);
                                                              }
                                                              kk(fas, ty, function(err, fasIds) {
                                                                if (err) return next(err);
                                                                delegatedToFaYes = diff(fasIds, positivers);
                                                                delegatedToFaNo = diff(delegatedToFaYes, negativers);
                                                                delegatedToFaAbs = diff(delegatedToFaNo, abstentioners);
                                                                delegatedToFa = delegatedToFaAbs.length;

                                                                Users.find({"delegatedParty": parties["upn"]}, function (err, upns) {
                                                                  ty = []
                                                                  for (var i = 0; i < upns.length; i++) {
                                                                      ty.push(upns[i]._id);
                                                                  }
                                                                  kk(upns, ty, function(err, upnsIds) {
                                                                    if (err) return next(err);
                                                                    delegatedToUpnYes = diff(upnsIds, positivers);
                                                                    delegatedToUpnNo = diff(delegatedToUpnYes, negativers);
                                                                    delegatedToUpnAbs = diff(delegatedToUpnNo, abstentioners);
                                                                    delegatedToUpn = delegatedToUpnAbs.length;

                                                                    Users.find({"delegatedParty": parties["bildu"]}, function (err, bildus) {
                                                                      ty = []
                                                                      for (var i = 0; i < bildus.length; i++) {
                                                                          ty.push(bildus[i]._id);
                                                                      }
                                                                      kk(bildus, ty, function(err, bildusIds) {
                                                                        if (err) return next(err);
                                                                        delegatedToBilduYes = diff(bildusIds, positivers);
                                                                        delegatedToBilduNo = diff(delegatedToBilduYes, negativers);
                                                                        delegatedToBilduAbs = diff(delegatedToBilduNo, abstentioners);
                                                                        delegatedToBildu = delegatedToBilduAbs.length;

                                                                        Users.find({"delegatedParty": parties["nd"]}, function (err, nds) {
                                                                          ty = []
                                                                          for (var i = 0; i < nds.length; i++) {
                                                                              ty.push(nds[i]._id);
                                                                          }
                                                                          kk(nds, ty, function(err, ndsIds) {
                                                                            if (err) return next(err);
                                                                            delegatedToNdYes = diff(ndsIds, positivers);
                                                                            delegatedToNdNo = diff(delegatedToNdYes, negativers);
                                                                            delegatedToNdAbs = diff(delegatedToNdNo, abstentioners);
                                                                            delegatedToNd = delegatedToNdAbs.length;

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
                                                                            console.log("delegatedToCompromis");
                                                                            console.log(delegatedToCompromis);
                                                                            // PP
                                                                            if (req.body.pp == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToPP
                                                                                req.body.positiveParties.push(parties["pp"]);
                                                                            } else if (req.body.pp == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToPP
                                                                                req.body.negativeParties.push(parties["pp"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToPP
                                                                                req.body.abstentionParties.push(parties["pp"]);
                                                                            }
                                                                            // Psoe
                                                                            if (req.body.psoe == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToPsoe
                                                                                req.body.positiveParties.push(parties["psoe"]);
                                                                            } else if (req.body.psoe == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToPsoe
                                                                                req.body.negativeParties.push(parties["psoe"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToPsoe
                                                                                req.body.abstentionParties.push(parties["psoe"]);
                                                                            }
                                                                            // Podemos
                                                                            if (req.body.podemos == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToPodemos
                                                                                req.body.positiveParties.push(parties["podemos"]);
                                                                            } else if (req.body.podemos == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToPodemos
                                                                                req.body.negativeParties.push(parties["podemos"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToPodemos
                                                                                req.body.abstentionParties.push(parties["podemos"]);
                                                                            }
                                                                            // Ciudadanos
                                                                            if (req.body.ciudadanos == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToCiudadanos
                                                                                req.body.positiveParties.push(parties["ciudadanos"]);
                                                                            } else if (req.body.ciudadanos == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToCiudadanos
                                                                                req.body.negativeParties.push(parties["ciudadanos"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToCiudadanos
                                                                                req.body.abstentionParties.push(parties["ciudadanos"]);
                                                                            }
                                                                            // Erc
                                                                            if (req.body.erc == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToErc
                                                                                req.body.positiveParties.push(parties["erc"]);
                                                                            } else if (req.body.erc == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToErc
                                                                                req.body.negativeParties.push(parties["erc"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToErc
                                                                                req.body.abstentionParties.push(parties["erc"]);
                                                                            }
                                                                            // Pnv
                                                                            if (req.body.pnv == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToPnv
                                                                                req.body.positiveParties.push(parties["pnv"]);
                                                                            } else if (req.body.pnv == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToPnv
                                                                                req.body.negativeParties.push(parties["pnv"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToPnv
                                                                                req.body.abstentionParties.push(parties["pnv"]);
                                                                            }
                                                                            // Compromis
                                                                            if (req.body.compromis == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToCompromis
                                                                                req.body.positiveParties.push(parties["compromis"]);
                                                                            } else if (req.body.compromis == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToCompromis
                                                                                req.body.negativeParties.push(parties["compromis"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToCompromis
                                                                                req.body.abstentionParties.push(parties["compromis"]);
                                                                            }
                                                                            // Coalicion Canaria
                                                                            if (req.body.cc == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToCc
                                                                                req.body.positiveParties.push(parties["cc"]);
                                                                            } else if (req.body.cc == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToCc
                                                                                req.body.negativeParties.push(parties["cc"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToCc
                                                                                req.body.abstentionParties.push(parties["cc"]);
                                                                            }
                                                                            // Nueva canaria
                                                                            if (req.body.nc == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToNc
                                                                                req.body.positiveParties.push(parties["nc"]);
                                                                            } else if (req.body.nc == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToNc
                                                                                req.body.negativeParties.push(parties["nc"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToNc
                                                                                req.body.abstentionParties.push(parties["nc"]);
                                                                            }
                                                                            // Foro Asturias
                                                                            if (req.body.fa == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToFa
                                                                                req.body.positiveParties.push(parties["fa"]);
                                                                            } else if (req.body.fa == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToFa
                                                                                req.body.negativeParties.push(parties["fa"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToFa
                                                                                req.body.abstentionParties.push(parties["fa"]);
                                                                            }
                                                                            // UPN
                                                                            if (req.body.upn == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToUpn
                                                                                req.body.positiveParties.push(parties["upn"]);
                                                                            } else if (req.body.upn == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToUpn
                                                                                req.body.negativeParties.push(parties["upn"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToUpn
                                                                                req.body.abstentionParties.push(parties["upn"]);
                                                                            }
                                                                            // Bildu
                                                                            if (req.body.bildu == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToBildu
                                                                                req.body.positiveParties.push(parties["bildu"]);
                                                                            } else if (req.body.bildu == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToBildu
                                                                                req.body.negativeParties.push(parties["bildu"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToBildu
                                                                                req.body.abstentionParties.push(parties["bildu"]);
                                                                            }
                                                                            // No Delegar
                                                                            if (req.body.nd == 1) {
                                                                                req.body.positive = req.body.positive + delegatedToNd
                                                                                req.body.positiveParties.push(parties["nd"]);
                                                                            } else if (req.body.nd == 2) {
                                                                                req.body.negative = req.body.negative + delegatedToNd
                                                                                req.body.negativeParties.push(parties["nd"]);
                                                                            } else {
                                                                                req.body.abstention = req.body.abstention + delegatedToNd
                                                                                req.body.abstentionParties.push(parties["nd"]);
                                                                            }

                                                                            // Update law
                                                                            console.log('Updating law');
                                                                            law.pp = req.body.pp;
                                                                            law.psoe = req.body.psoe;
                                                                            law.podemos = req.body.podemos;
                                                                            law.ciudadanos = req.body.ciudadanos;
                                                                            law.erc = req.body.erc;
                                                                            law.pnv = req.body.pnv;
                                                                            law.compromis = req.body.compromis;
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

lawRouter.route('/:slug/comments')

.get(function (req, res, next) {
    Laws.findOne({"slug": req.params.slug})
        .populate('comments.postedBy')
        .exec(function (err, law) {
        if (err) return next(err);
        res.json(law.comments);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findOne({"slug": req.params.slug}, function (err, law) {
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
    Laws.findOne({"slug": req.params.slug}, function (err, law) {
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

lawRouter.route('/:slug/votes')

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    kk = function(user, law, callback) {
        console.log("INICIO kk");
        console.log(user);
        Votes.find({"lawId": law._id, "userId": user.delegatedUser}).exec(function (err, votes) {
            if (!votes.length) {
                console.log("El usuario delegado no votó");
                console.log(user.delegatedUser);
                // Check if delegated user has delegation vote
                Users.findById(user.delegatedUser, function (err, delegatedUser) {
                    if (err) return next(err);
                    if (delegatedUser.delegatedParty == null && delegatedUser.delegatedUser == null) {
                        console.log("No further delegation");
                        return callback(null, -1);
                    } else if (delegatedUser.delegatedParty == null) {
                        console.log("Further Delegation to a user");
                        return kk(delegatedUser, law, callback);
                    } else {
                        console.log("Further Delegation to a party");
                        if (law.positiveParties.indexOf(delegatedUser.delegatedParty) != -1) {
                            return callback(null, 1);
                        }
                        if (law.negativeParties.indexOf(delegatedUser.delegatedParty) != -1) {
                            return callback(null, 2);
                        }
                        if (law.abstentionParties.indexOf(user.delegatedParty) != -1) {
                            return callback(null, 3);
                        }
                    }
                });
            } else {
                console.log("El usuario delegado SI votó");
                console.log(votes[0])
                return callback(null, votes[0].vote);
            }
        });
    }
    Laws.findOne({"slug": req.params.slug}, function (err, law) {
        if (err) return next(err);
        console.log("En post de votes");
        console.log(req.body);
        console.log(law.positive);
        // Find previous vote from same user
        Votes.find({"lawId": law._id, "userId": req.decoded._id}).exec(function (err, votes) {
            if (err) return next(err);
            console.log(votes.length);
            if (!votes.length) {
                console.log("No previous vote found");
                // Find delegations to other user: if so, remove delegated vote and add own vote
                Users.findById(req.decoded._id, function (err, user) {
                    if (err) return next(err);
                    console.log("User delegation: " + user.delegatedUser);
                    if (user.delegatedUser == null) {
                        console.log("No delega a ningun tio");
                        console.log(user);
                        console.log("Party delegation: " + user.delegatedParty)
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
                        var newVote = new Votes({"lawId": law._id, "userId": req.decoded._id, "vote": req.body.vote});
                        console.log(newVote);
                        newVote.save(function (err, v) {
                            if (err) return console.error(err);
                            console.log('Saved Vote!');
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
                        // Check if delegated user has voted. If so remove it and add own vote
                        new_votes = kk(user, law, function(err, votoDelegado) {
                            if (err) return next(err);
                            console.log(votoDelegado);
                            // Delegated user has not voted and delegations
                            if (votoDelegado == -1) {
                                console.log("No vote, no delegations");
                            } else if (votoDelegado == 1) {
                                console.log("User delegation result into positive vote")
                                law.positive = law.positive - 1;
                            } else if (votoDelegado == 2) {
                                law.negative = law.negative - 1;
                                console.log("User delegation result into negative vote")
                            } else {
                                console.log("User delegation result into abstention vote")
                                law.abstention = law.abstention - 1;
                            }
                            // Create vote
                            console.log(req.body.vote);
                            var newVote = new Votes({"lawId": law._id,
                                                     "userId": req.decoded._id,
                                                     "vote": req.body.vote});
                            console.log(newVote);
                            newVote.save(function (err, v) {
                                if (err) return console.error(err);
                                console.log('Saved Vote!');
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
                        });
                    }
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
                    // Create vote
                    console.log(req.params.vote);
                    var newVote = new Votes({"lawId": law._id,
                                             "userId": req.decoded._id,
                                             "vote": req.body.vote});
                    console.log(newVote);
                    newVote.save(function (err, v) {
                        if (err) return console.error(err);
                        console.log('Saved Vote!');
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
                });
            }
        });
    });
});

lawRouter.route('/:slug/comments/:commentId')

.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findOne({"slug": req.params.slug})
        .populate('comments.postedBy')
        .exec(function (err, law) {
        if (err) return next(err);
        res.json(law.comments.id(req.params.commentId));
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Laws.findOne({"slug": req.params.slug}, function (err, law) {
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
    Laws.findOne({"slug": req.params.slug}, function (err, law) {
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

lawRouter.route('/:slug/comments/:commentId/votes')
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Laws.findOne({"slug": req.params.slug}, function (err, law) {
        if (err) return next(err);
        console.log("En post de comment votes");
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