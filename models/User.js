import mongoose from "mongoose";
import crypto from "crypto";

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    username: { type: String, required: true, trim: true, unique: true },
    hashed_password: { type: String, required: true, trim: true },
    salt: String,
  },
  { timestamps: true }
);

// Virtual password
schema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Methods
schema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password || !this.salt) return "";
    const salt = new Buffer(this.salt, "base64");
    return crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("base64");
  },

  makeSalt: function () {
    return crypto.randomBytes(16).toString("base64");
  },
};

const User = mongoose.model("User", schema);

export default User;
