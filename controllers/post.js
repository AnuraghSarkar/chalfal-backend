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
    // Find all posts and send them to the client
    const postsCount = await Post.countDocuments();
    const paginated = paginateResults(page, limit, postsCount);
    const allPosts = await Post.find({})
        .sort(sortQuery).select("-comments").limit(limit).skip(paginated.startIndex).populate("author", "username").populate("subreddit", "subredditName");
    const paginatedPosts = {
        previous: paginated.results.previous,
        results:allPosts,
        next: paginated.results.next,
    }
    res.status(200).json(paginatedPosts);
};
const getSuscribedPosts = async (req, res) => { 
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // user validation
    const user = await User.findById(req.user);
    if (!user) {
        return res.status(404).send({
            message: "User not found"
        });
    }
    //  get all suscribed subscribedSubreddits
    const subscribedSubs = await Subreddit.find({
        _id: { $in: user.subscribedSubs }
    });
    // counting posts for each subreddit
    const postsCount = subscribedSubs.map(sub => sub.posts.length).reduce((a, b) => b + a, 0);
    const paginated = paginateResults(page, limit, postsCount);

    // get all subscribed posts
    const suscribedPosts = await Post.find({ subreddit: { $in: subscribedSubs } }).sort({ hotAlgorithm: -1 }).limit(limit).skip(paginated.startIndex).populate("author", "username").populate("subreddit", "subredditName").select("-comments");
    const paginatedPosts = {
        previous: paginated.results.previous,
        results: suscribedPosts,
        next: paginated.results.next,
    }
    res.status(200).json(paginatedPosts);
};

module.exports = { getPosts, getSuscribedPosts };
