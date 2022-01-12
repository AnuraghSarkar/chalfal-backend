import express from "express";
const router = express.Router();
import Post from "../../models/post";
import dotenv from "dotenv";
dotenv.config();

router.get("/posts", (req, res) => {
  Post.find()
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json(err));
});
export default router;
