const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mapId: {
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
