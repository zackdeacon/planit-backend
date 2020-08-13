const bcrypt = require("bcrypt")
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
  name: {
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    }
  },
  createdMaps: [
    {
      type: Schema.Types.ObjectId,
      ref: "Map",
    },
  ],
  guestMaps: [
    {
      type: Schema.Types.ObjectId,
      ref: "Map",
    },
  ],
  invitations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Map",
    },
  ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

//before you create the user, take the password that you have for the user and generate a random 10 character encryption
User.beforeCreate(function(user){
  user.password = bcrypt.hashSync(user.password,bcrypt.genSaltSync(10),null);
})


module.exports = User;
