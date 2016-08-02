var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

var voteSchema = new Schema({
    vote: {
        type: Number,
        min: 1,
        max: 3,
        required:true
    },
    votedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

// create a schema
var lawSchema = new Schema({
      law_type: String,
      institution: String,
      tier: Number,
      headline: String,
      short_description: String,
      long_description: String,
      link: String,
      pub_date: Date,
      vote_start: Date,
      vote_end: Date,
      positive: Number,
      negative: Number,
      abstention: Number,
      official_positive: Number,
      official_negative: Number,
      official_abstention: Number,
      featured: {
        type: Boolean,
        default:false
      },
      comments: [commentSchema],
      votes: [voteSchema]
}, {
    timestamps: true
});

lawSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.votes;
        return ret;
    }
});

// the schema is useless so far
// we need to create a model using it
var Laws = mongoose.model('Law', lawSchema);

// make this available to our Node applications
module.exports = Laws;
