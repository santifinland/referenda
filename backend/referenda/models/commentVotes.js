var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var commentVoteSchema = new Schema({
      lawId: String,
      commentId: String,
      userId: String,
      vote: Number  // 1: positive, 2: negative.
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var CommentVotes = mongoose.model('CommentVote', commentVoteSchema);

// make this available to our Node applications
module.exports = CommentVotes;
