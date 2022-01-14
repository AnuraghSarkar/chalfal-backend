const Subreddit = require("../models/subreddit");
const Post = require("../models/post");
const User = require("../models/user");

// fetching all subreddits
const getSubreddits = (req, res) => {
  const allSubreddits = await Subreddit.find({}).select("id subredditName");
  res.status(200).json(allSubreddits);
};

// getting all posts from a subreddit
const getSubredditPosts = async (req, res) => {};

module.exports = { getSubreddits, getSubredditPosts };
