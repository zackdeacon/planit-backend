const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  map: {
    type: Schema.Types.ObjectId,
    ref: "Map",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
