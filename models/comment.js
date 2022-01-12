import Mongoose from "mongoose";

const { Schema } = Mongoose;

// Post and COmment Schema
const CommentSchema = new Schema({
  author: { type: String, required: true },
  title: { type: String },
  body: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
});

export default Mongoose.model("Comment", CommentSchema);
