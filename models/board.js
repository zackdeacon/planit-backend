const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  guests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dates: {
    start: Date,
    end: Date,
  },
  destinations: [String],
  suggestionCategories: [String],
  suggestions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Suggestion",
    },
  ],
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
}, { timestamps: true });

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
