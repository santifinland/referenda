var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');
var Parties = require('../models/parties');

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
    name = req.params.username.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    if (name.length < 4) {
        return res.status(405).json({"Reason": "username pattern too short"});
    } else {
        User.find({"username": new RegExp('^'+name, "i")}, {"_id": 0}).limit(4).select("username")
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
  User.register(new User(
    { username : req.body.username }),
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
        .select("delegatedParty")
        .exec(function (err, user) {
        if (err) return next(err);
        console.log(user);
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
        console.log(req.body.party);
        Parties.findOne({'name': req.body.party})
            .select("name logo quota -_id")
            .exec(function(err, party) {
            if (err) return next(err);
            if (party) {
                user.delegatedParty = party.name;
                user.delegatedUser = null;
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
    User.findById(req.decoded._id)
        .select("delegatedUser")
        .exec(function (err, user) {
        if (err) return next(err);
        console.log(user.delegatedUser);
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
    console.log(req.body);
    User.findById(req.decoded._id, function (err, user) {
        if (err) return next(err);
        console.log("body.id");
        console.log(req.body.id);
        User.findOne({"username": req.body.username})
            .select("delegatedUser")
            .exec(function(err, delegatedUser) {
            if (err) return next(err);
            if (delegatedUser) {
                user.delegatedUser = delegatedUser._id;
                user.delegatedParty = null;
                console.log("usernmae");
                console.log(delegatedUser);
                user.save(function (err, user) {
                    if (err) return next(err);
                    console.log('Updated User!');
                    res.status(200).json({"username": req.body.username});
                });
            } else {
                res.status(400).json({status: 'User not found'});
            }
        });
    });
});

module.exports = userRouter;
