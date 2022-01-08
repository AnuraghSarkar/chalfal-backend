const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: () => {
      return this.provider !== "email" ? false : true;
    },
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
    default: "email",
  },
  googleId: {
    type: String,
  },

  avatar: {
    type: String,
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("User", UserSchema);
