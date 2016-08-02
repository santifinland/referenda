var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    password: String,
    admin:   {
        type: Boolean,
        default: false
    },
    delegatedUser: {
        type: String,
        default: null
    },
    delegatedParty: {
        type: String,
        default: null
    }
});

User.methods.getName = function() {
    return (this.username);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);