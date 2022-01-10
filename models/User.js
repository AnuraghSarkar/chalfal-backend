import Mongoose from "mongoose";

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
  avatar: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default Mongoose.model("User", UserSchema);
