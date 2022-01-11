import Mongoose from "mongoose";

const { Schema } = Mongoose;

// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  avatar: {
    type: String,
    default: function () {
      return `https://gravatar.com/avatar/${this._id}?s=400&d=robohash&r=x`;
    },
      
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default Mongoose.model("User", UserSchema);
