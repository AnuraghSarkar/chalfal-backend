const express = require("express");
const { auth } = require("../utils/middleware");
const {
  getPosts,
  getSubscribedPosts,
  getSearchedPosts,
  getPostAndComments,
  createNewPost,
  updatePost,
  deletePost,
} = require("../controllers/post");
const { upvotePost, downvotePost } = require("../controllers/postVote");
const {
  postComment,
  deleteComment,
  updateComment,
  postReply,
  deleteReply,
  updateReply,
} = require("../controllers/postComment");
const {
  upvoteComment,
  downvoteComment,
  upvoteReply,
  downvoteReply,
} = require("../controllers/commentVote");

const router = express.Router();

//CRUD posts routes
router.get("/", getPosts);
router.get("/subscribed", auth, getSubscribedPosts);
router.get("/search", getSearchedPosts);
router.get("/:id/comments", getPostAndComments);
router.post("/", auth, createNewPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

//posts vote routes
router.post("/:id/upvote", auth, upvotePost);
router.post("/:id/downvote", auth, downvotePost);


module.exports = router;