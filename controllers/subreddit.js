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
        case 'new':
            sortQuery = { createdAt: -1 };
            break;
        case 'top':
            sortQuery = { pointsCount: -1 };
            break;
        case 'hot':
            sortQuery = { hotAlgorithm: -1 };
            break;
        case 'best':
            sortQuery = { voteRation: -1 };
            break;
        case 'controversial':
            sortQuery = { controversialAlgorithm: -1 };
            break;
        case 'old':
            sortQuery = { createdAt: 1 };
            break;
        default:
            sortQuery = { createdAt: -1 };

    }
};

module.exports = { getSubreddits, getSubredditPosts };
