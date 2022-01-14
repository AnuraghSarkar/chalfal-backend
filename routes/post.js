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

module.exports = router;