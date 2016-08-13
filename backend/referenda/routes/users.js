var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');
var Parties = require('../models/parties');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/find/:username')
/* GET users listing. */
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
    name = req.params.username.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    console.log(name);
    if (name.length < 4) {
        return res.status(200).json([]);
    } else {
        User.find({"username": new RegExp('^'+name, "i")}).limit(4).select("username")
            .exec(function (err, users) {
            if (err) return next(err);
            res.status(200).json(users);
        });
    }
});

userRouter.route('/logged')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  res.status(200).json({"tt": "kk"});
});

userRouter.route('/register')
.post(function(req, res) {
    User.register(new User({ username : req.body.username }),
        req.body.password, function(err, user) {
        if (err) {
            console.log('in register: ', req.body.username);
            return res.status(500).json({err: err});
        }
        user.save(function(err,user) {
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration Successful!'});
            });
        });
    });
});

userRouter.route('/login')
.post(function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});

      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
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
    console.log(req.decoded._id);
    User.findById(req.decoded._id)
        .exec(function (err, user) {
        if (err) return next(err);
        res.status(200).json({"id": user.delegatedParty});
    });
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        console.log(req.body.party);
        Parties.find({'name': req.body.party}, function(err, parties) {
            if (err) return next(err);
            party = parties[0];
            if (party != null) {
                user.delegatedParty = party._id;
                console.log(party.name);
                user.save(function (err, user) {
                    if (err) return next(err);
                    console.log('Updated Party!');
                    res.status(200).json(party);
                });
            } else {
                res.status(400).json({status: 'Party not found'});
            }
        });
    });
});

userRouter.route('/delegateuser')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    console.log(req.decoded._id);
    User.findById(req.decoded._id)
        .exec(function (err, user) {
        if (err) return next(err);
        res.status(200).json({"id": user.delegatedUser});
    });
})
.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        console.log("body.id");
        console.log(req.body.id);
        User.findById(req.body.id, function(err, delegatedUser) {
            if (err) return next(err);
            if (delegatedUser != null) {
                user.delegatedUser = delegatedUser._id;
                console.log("usernmae");
                console.log(delegatedUser);
                user.save(function (err, user) {
                    if (err) return next(err);
                    console.log('Updated User!');
                    res.status(200).json({});
                });
            } else {
                res.status(400).json({status: 'User not found'});
            }
        });
    });
});

module.exports = userRouter;
