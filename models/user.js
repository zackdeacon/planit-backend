const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
      },
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
  },
  { timestamps: true }
);

//encrypt password before adding to database
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
