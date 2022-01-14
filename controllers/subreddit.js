const Subreddit = require("../models/subreddit");
const Post = require("../models/post");
const User = require("../models/user");

const paginateResults = require("../utils/paginateResults");
// fetching all subreddits
const getSubreddits = (req, res) => {
  const allSubreddits = await Subreddit.find({}).select("id subredditName");
  res.status(200).json(allSubreddits);
};

// getting all posts from a subreddit
const getSubredditPosts = async (req, res) => {
  const { subredditName } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "createdAt";

  // sorting subreddit posts
  let sortQuery;
  // switch statement to sort by different fields
  switch (sortBy) {
    case "new":
      sortQuery = { createdAt: -1 };
      break;
    case "top":
      sortQuery = { pointsCount: -1 };
      break;
    case "hot":
      sortQuery = { hotAlgorithm: -1 };
      break;
    case "best":
      sortQuery = { voteRation: -1 };
      break;
    case "controversial":
      sortQuery = { controversialAlgorithm: -1 };
      break;
    case "old":
      sortQuery = { createdAt: 1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
  }
  // finding subreddit
  const subreddit = await Subreddit.findOne({
    subredditName: { $regex: new RegExp("^" + subredditName + "$", "i") },
  }).populate("admin", "username");
  // if subreddit is not found
  if (!subreddit) {
    return res.status(404).send({
      message: `Subreddit ${subredditName} not found`,
    });
  }
  // finding posts
  const postsCount = await Post.countDocuments({ subreddit: subreddit._id });
  // paginating posts
  const paginated = paginateResults(page, limit, postsCount);
  const subredditPosts = await Post.find({ subreddit: subreddit._id })
    .sort(sortQuery)
    .select("comments")
    .skip(paginated.startIndex)
    .limit(limit)
    .populate("author", "username")
    .populate("subreddit", "subredditName");

  // giving paginated results
  const paginatedPosts = {
    previous: paginated.results.previous,
    next: paginated.results.next,
    results: subredditPosts,
  };
  // sending response
  res.status(200).json({ subDetails: subreddit, posts: paginatedPosts });
};

const getTopSubreddits = async (_req, res) => {
  const top10Subreddits = await Subreddit.find({})
    .sort({ subscriberCount: -1 })
    .limit(10)
    .select("-description -posts -admin ");

  res.status(200).json(top10Subreddits);
};

// creating a new subreddit
const createNewSubreddit = async (req, res) => { };

module.exports = { getSubreddits, getSubredditPosts, getTopSubreddits, createNewSubreddit };
