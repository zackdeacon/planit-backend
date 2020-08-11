const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  vote: Boolean,
}, { timestamps: true });

const suggestionSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  title: {
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
}, { timestamps: { createdAt: "suggestedAt" } });

const Suggestion = mongoose.model("Suggestion", suggestionSchema);

module.exports = Suggestion;
