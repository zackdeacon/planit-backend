const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mapSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  creator: {
    type: String
  },
  // creatorId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  guests: [
    {
      type: String
    },
  ],
  // guests: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
  dates: {
    start: {
      type: String,
      default: "",
    },
    end: {
      type: String,
      default: "",
    },
  },
  destinations: [String],
  suggestionCategories: {
    type: [String],
    default: ["Accomodation", "Flights", "Food", "Entertainment"],
  },
}, { timestamps: true });

const Map = mongoose.model("Map", mapSchema);

module.exports = Map;
