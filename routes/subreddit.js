const express = require("express");
const { auth } = require("../utils/middleware");
const {
  getSubreddits,
  getSubredditPosts,
  getTopSubreddits,
  createNewSubreddit,
  editSubDescription,
  deleteSubreddit,
} = require("../controllers/subreddit");
const router = express.Router();
router.get("/", getSubreddits);
router.get("/r/:subredditName", getSubredditPosts);
router.get("/top10", getTopSubreddits);
router.post("/", auth, createNewSubreddit);
router.patch("/:id", auth, editSubDescription);
router.delete("/:id", auth, deleteSubreddit);
router.post("/:id/subscribe", auth, subscribeToSubreddit);

exports.router = router;
