const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/user');
const validator = require("email-validator");
const Verify = require('./verify');
const Parties = require('../models/parties');
const config = require('../config.js');
const Password = require('./password.js');


var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/')
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
  User.remove({}, function (err, resp) {
    if (err) return next(err);
    if (resp) {
      console.log('All users deleted')
      res.status(204).end();
    } else {
      console.log('Error deleting users')
      res.status(404).end();
    }
  });
});

userRouter.route('/find/:username')
/* GET users listing. */
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
    let name = req.params.username.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    if (name.length < 1) {
        return res.status(405).json({"Reason": "username pattern too short"});
    } else {
        User.find({"username": new RegExp('^'+name, "i")}, {"_id": 0}).limit(3).select("username")
            .exec(function (err, users) {
            if (err) return next(err);
            res.status(200).json(users);
        });
    }
});

userRouter.route('/logged')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  res.status(200).end();
});

userRouter.route('/register')
.post(function(req, res) {
  console.log("Recibido un registro");
  console.log(req.body);
  if ((req.body.username.length < 4) || (req.body.username.length > 15)) {
    return res.status(400).json({err: "Username too long"});
  }
  if ((req.body.consent !== true) && (req.body.consent !== false)) {
    return res.status(400).json({err: "Bad consent"});
  }
  if (validator.validate(req.body.email)) {
    User.find({"mail": req.body.email}).exec(function (err, user) {
      if (err) {
        return res.status(500).json({err: err});
      }
      if (user.length > 0) {
        console.log("Mail ya usado");
        console.log(user);
        return res.status(200).json({err: 'Registration Successful!'});
      }
      if (user.length === 0) {
        console.log("Mail libre");
        User.register(new User(
          { username: req.body.username, mail: req.body.email, origin: "referenda", consent: req.body.consent }),
          // { username : req.body.username, admin: req.body.admin }),
          req.body.password,
          function(err, user) {
            if (err) {
              console.log('in register: ', req.body.username);
              return res.status(500).json({err: err});
            }
            user.save(function(err,user) {
              passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration Successful!'});
              });
            });
          }
        );
      }
    });
  } else {
    return res.status(400).json({err: 'Invalid email'});
  }
});

userRouter.route('/login')
.post(function(req, res, next) {
  if (req.body.username.indexOf("@") > -1) {
    res.status(401).end();
  } else {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          err: info
        });
      }
      //if (user.origin.indexOf("google") > -1) {
        //res.status(401).end();
      //}
      //if (user.origin.indexOf("facebook") > -1) {
        //res.status(401).end();
      //}
      req.logIn(user, function(err) {
        if (err) {
          return res.status(500).json({
            err: 'Could not log in user'
          });
        }

        const token = Verify.getToken({"username": user.username, "_id": user._id, "admin": user.admin});

        res.status(200).json({
          username: user.username,
          token: token,
          origin: user.origin
        });
      });
    })(req,res,next);
  }
});

userRouter.route('/username')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
  User.findById(req.decoded._id, function (err, user) {
    if (err) return next(err);
    res.status(200).json({username: user.username});
  });
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
  if ((req.body.username.length < 4) || (req.body.username.length > 15)) {
    return res.status(400).json({err: "Username too long"});
  }
  User.findById(req.decoded._id, function (err, user) {
    if (err) return next(err);
    if (user) {
      console.log(user);
      console.log(req.body.username);
      User.find({"username": req.body.username}).exec(function (err, usernameUsers) {
        if (err) {
          return res.status(500).json({err: err});
        }
        if (usernameUsers.length > 0) {
          console.log(usernameUsers);
          console.log("Username already in use");
          res.status(400).json({status: 'Impossible to change username'});
        } else {
          console.log("Changing username");
          user.username = req.body.username;
          user.save(function (err, user) {
            if (err) return next(err);
            console.log('Updated User!');
            res.status(201).json({status: 'Username changed'});
          });
        }
      });
    } else {
      res.status(401).json({status: 'Invalid credentials'});
    }
  });
});

userRouter.route('/password')
.post(function(req, res) {
  if (validator.validate(req.body.email)) {
    User.find({"mail": req.body.email}).exec(function (err, user) {
      if (err) {
        return res.status(500).json({err: err});
      }
      if (user.length > 0) {
        console.log("Mail encontrado");
        if (user[0].origin === 'referenda') {
          console.log(user[0]);
          Password.sendMail(user[0]);
          return res.status(200).json({err: 'Correo enviado!'});
        } else {
          return res.status(200).json({err: 'Correo enviado!'});
        }
      }
      if (user.length === 0) {
        console.log("Mail no encontrado");
        return res.status(200).json({err: 'Correo enviado!'});
      }
    });
  } else {
    return res.status(400).json({err: 'Invalid email'});
  }
});

userRouter.route('/set-password')
.post(Verify.verifyOrdinaryUser, function(req, res) {
  console.log("tooooooooooooooken");
  let token = req.body.token;
  console.log(token);
  let password = req.body.password;
  console.log(password);
  console.log(req.decoded);
  console.log(req.decoded.username);
  User.findOne({"username": req.decoded.username}).exec(function (err, user) {
    if (err) {
      return res.status(500).json({err: err});
    }
    if (user) {
      console.log(user);
      user.setPassword(password, function (err, user) {
        if (err) {
          return res.status(500).json({err: err});
        }
        if (user) {
          user.save(function(err, user) {
            if (err) {
              console.log(err);
            } else {
              console.log("password cambiada");
              console.log(user);
              return res.status(201).end();
            }
          });
        }
      });
    }
  });
});

userRouter.route('/googleregister')
.post(function(req, res, next) {
  console.log(req.body);
  // Extrater el nombre de usuario y el mail del token preguntando a google
  https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + req.body.token, (resp) => {
    let data = '';
    // The whole response has been received. Print out the result.
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      console.log(data);
      console.log(JSON.parse(data));
      // TODO: Verificar que el token es correcto
      User.findOne({"mail": JSON.parse(data).email})
        .exec(function(err, user) {
          if (err) return next(err);
          if (user) {
            // Logar al usuario mediante la creación de un jwt
            req.logIn(user, function(err) {
              if (err) {
                return res.status(500).json({
                  err: 'Could not log in user'
                });
              }
              const token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
              res.status(200).json({
                username: user.username,
                token: token,
                origin: "google"
              });
            });
          } else {
            if ((req.body.consent !== true) && (req.body.consent !== false)) {
              return res.status(400).json({err: "Bad consent"});
            }
            User.register(new User(
              {username: req.body.username, mail: JSON.parse(data).email, origin: "google", consent: req.body.consent}),
              "Google01!",
              function(err, user) {
                if (err) {
                  return res.status(500).json({err: err});
                }
                user.save(function(err, user) {
                  if (err) {
                  } else {
                    req.logIn(user, function(err) {
                      if (err) {
                        return res.status(500).json({
                          err: 'Could not log in user'
                        });
                      }
                      const token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
                      res.status(200).json({
                        username: user.username,
                        token: token,
                        origin: "google"
                      });
                    });
                  }
                });
              }
            );
          }
        });
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
  // Mirar si el usuario ya existe
  // Si no existe, crearlo
  // Logar al usuario mediante la creación de un jwt
});

userRouter.route('/facebookregister')
.post(function(req, res, next) {
  // Extrater el nombre de usuario y el mail del token preguntando a facebook
  https.get('https://graph.facebook.com/debug_token?input_token=' + req.body.token + '&access_token=' + config.facebookAppToken, (resp) => {
    let data = '';
    // The whole response has been received. Print out the result.
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      // TODO: Verificar que el token es correcto
      if (JSON.parse(data).is_valid == false) return next(err);
      User.findOne({"mail": req.body.email})
        .exec(function(err, user) {
          if (err) return next(err);
          if (user) {
            // Logar al usuario mediante la creación de un jwt
            req.logIn(user, function(err) {
              if (err) {
                return res.status(500).json({
                  err: 'Could not log in user'
                });
              }
              var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
              res.status(200).json({
                username: user.username,
                token: token
              });
            });
          } else {
            if ((req.body.consent != true) && (req.body.consent != false)) {
              return res.status(400).json({err: "Bad consent"});
            }
            User.register(new User(
              { username: req.body.username, mail: req.body.email, origin: "facebook", consent: req.body.consent }),
              "Facebook01!",
              function(err, user) {
                if (err) {
                  return res.status(500).json({err: err});
                }
                user.save(function(err, user) {
                  if (err) {
                  } else {
                    req.logIn(user, function(err) {
                      if (err) {
                        return res.status(500).json({
                          err: 'Could not log in user'
                        });
                      }
                      var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
                      res.status(200).json({
                        username: user.username,
                        token: token
                      });
                    });
                  }
                });
              }
            );
          }
        });
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
  // Mirar si el usuario ya existe
  // Si no existe, crearlo
  // Logar al usuario mediante la creación de un jwt
});

userRouter.route('/logout')
.get(function(req, res) {
    req.logout();
    res.status(200).json({
    status: 'Bye!'
  });
});

userRouter.route('/delegateparty')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    User.findById(req.decoded._id)
        .select("delegatedParty")
        .exec(function (err, user) {
        if (err) return next(err);
        Parties.findOne({'name': user.delegatedParty})
            .select("name logo quota -_id")
            .exec(function(err, party) {
            if (err) return next(err);
            res.status(200).json(party);
        });
    });
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    User.findById(req.decoded._id, function (err, user) {
      if (err) return next(err);
      if (user) {
        Parties.findOne({'name': req.body.party})
            .select("name -_id")
            .exec(function(err, party) {
            if (err) return next(err);
            if (party) {
                user.delegatedParty = party.name;
                user.delegatedUser = null;
                user.save(function (err, user) {
                    if (err) return next(err);
                    res.status(200).json(party);
                });
            } else {
                res.status(400).json({status: 'Party not found'});
            }
        });
      } else {
        res.status(401).json({status: 'Invalid credentials'});
      }
    });
});

userRouter.route('/delegateuser')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    User.findById(req.decoded._id)
        .select("delegatedUser")
        .exec(function (err, user) {
        if (err) return next(err);
        User.findById(user.delegatedUser)
            .exec(function (err, delegatedUser) {
            if (err) return next(err);
            if (delegatedUser) {
                res.status(200).json({"username": delegatedUser.username});
            } else {
                res.status(404).end();
            }
        });
    });
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        User.findOne({"username": req.body.username})
            .select("delegatedUser")
            .exec(function(err, delegatedUser) {
            if (err) return next(err);
            if (delegatedUser) {
                user.delegatedUser = delegatedUser._id;
                user.delegatedParty = null;
                user.save(function (err, user) {
                    if (err) return next(err);
                    res.status(200).json({"username": req.body.username});
                });
            } else {
                res.status(400).json({status: 'User not found'});
            }
        });
    });
});

module.exports = userRouter;
