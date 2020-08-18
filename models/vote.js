const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    vote: Boolean,
  }, { timestamps: true });

  const Vote = mongoose.model("Vote", voteSchema)

  module.exports = Vote;