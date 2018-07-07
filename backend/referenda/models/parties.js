var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var partySchema = new Schema({
      name: String,
      description: String,
      logo: String,
      quota: Number,
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Parties = mongoose.model('Party', partySchema);

// make this available to our Node applications
module.exports = Parties;
