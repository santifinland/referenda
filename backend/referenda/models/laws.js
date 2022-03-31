const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs');

const commentSchema = new Schema({
    positive: {
        type: Number,
        default: 0
    },
    negative: {
        type: Number,
        default: 0
    },
    position: {
        type: Number,
        default: 1  // 1: second, 2: against, 3: abstention
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

commentSchema.add({ replies: [commentSchema] });

// create a schema
const lawSchema = new Schema({
      law_id: String,
      reviewed: Boolean,
      law_type: String,
      institution: [String],
      tier: Number,
      area: [String],
      headline: String,
      slug: String,
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
      commentsLength: Number,
      positiveParties: [String],
      negativeParties: [String],
      abstentionParties: [String]
}, {
    timestamps: true
});

lawSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.votes;
        return ret;
    }
});

lawSchema.plugin(URLSlugs('headline'), {field: 'slug'});

// the schema is useless so far
// we need to create a model using it
const Laws = mongoose.model('Law', lawSchema);

// make this available to our Node applications
module.exports = Laws;
