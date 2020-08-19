const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const potentialUserSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  invitedMapIds: [{
    type: Schema.Types.ObjectId,
    ref: "Map",
  }],
});

const PotentialUser = mongoose.model("PotentialUser", potentialUserSchema);

module.exports = PotentialUser;