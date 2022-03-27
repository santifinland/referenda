const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const voteSchema = new Schema({
      lawId: String,
      userId: String,
      vote: Number  // 1: second, 2: against, 3: abstention
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
const Votes = mongoose.model('Vote', voteSchema);

// make this available to our Node applications
module.exports = Votes;
