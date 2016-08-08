var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var voteSchema = new Schema({
      lawId: String,
      userId: String,
      vote: Number
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Votes = mongoose.model('Vote', voteSchema);

// make this available to our Node applications
module.exports = Votes;
