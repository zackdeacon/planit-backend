const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  author: {
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
}, { timestamps: { createdAt: "sentAt" } });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
