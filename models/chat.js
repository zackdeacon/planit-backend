const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
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
  message: {
    type: String,
    required: true,
  },
}, { timestamps: { createdAt: "sentAt" } });

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
