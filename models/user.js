const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  // Require name for signup?
  name: {
    first: String,
    last: String,
  },
  createdBoards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
  ],
  guestBoards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
  ],
  invitations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Board",
    },
  ],
}, { timestamps: { createdAt: "joinedAt" } });

const User = mongoose.model("User", userSchema);

module.exports = User;
