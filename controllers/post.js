const Post = require("../models/post");
const User = require("../models/user");
const { cloudinary, UPLOAD_PRESET } = require("../utils/config");
const Subreddit = require("../models/subreddit");

const getPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "createdAt";

  let sortQuery;
  // Swutch statement to determine the sort query
  switch (sortBy) {
    // Sort by most recent
    case "new":
      sortQuery = { createdAt: -1 };
      break;
    // Sort by most popular
    case "top":
      sortQuery = { pointsCount: -1 };
      break;
    // Sort by oldest
    case "old":
      sortQuery = { createdAt: 1 };
      break;
    // Sort by best post
    case "best":
      sortQuery = { voteRatio: -1 };
      break;
    // Sort by controversial
    case "controversial":
      sortQuery = { controversialAlgorithm: 1 };
      break;
    // Sort by hot
    case "hot":
      sortQuery = { hotAlgorithm: 1 };
      break;
    // Default sort
    default:
      sortQuery = {};
  }
};

module.exports = { getPosts };
