const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// https://mongoosejs.com/docs/subdocs.html
const voteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vote: Boolean,
}, { timestamps: true });

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: String,
}, { timestamps: true })

const suggestionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mapId: {
    type: Schema.Types.ObjectId,
    ref: "Map",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: String,
  cost: Number,
  date: Date,
  votes: [voteSchema],
  comments: [commentSchema],
}, { timestamps: true });

const Suggestion = mongoose.model("Suggestion", suggestionSchema);

module.exports = Suggestion;
