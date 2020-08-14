const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mapSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
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
  suggestionCategories: {
    type: [String],
    default: ["Accomodation", "Flights", "Food", "Entertainment"],
  },
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

const Map = mongoose.model("Map", mapSchema);

module.exports = Map;
