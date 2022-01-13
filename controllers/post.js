const Post = require("../models/post");
const User = require("../models/user");
const { cloudinary, UPLOAD_PRESET } = require("../utils/config");
const Subreddit = require("../models/subreddit");
const postTypeValidator = require("../utils/postTypeValidator");

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
    .sort(sortQuery)
    .select("-comments")
    .limit(limit)
    .skip(paginated.startIndex)
    .populate("author", "username")
    .populate("subreddit", "subredditName");
  const paginatedPosts = {
    previous: paginated.results.previous,
    results: allPosts,
    next: paginated.results.next,
  };
  res.status(200).json(paginatedPosts);
};
const getSuscribedPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  // user validation
  const user = await User.findById(req.user);
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }
  //  get all suscribed subscribedSubreddits
  const subscribedSubs = await Subreddit.find({
    _id: { $in: user.subscribedSubs },
  });
  // counting posts for each subreddit
  const postsCount = subscribedSubs
    .map((sub) => sub.posts.length)
    .reduce((a, b) => b + a, 0);
  const paginated = paginateResults(page, limit, postsCount);

  // get all subscribed posts
  const suscribedPosts = await Post.find({ subreddit: { $in: subscribedSubs } })
    .sort({ hotAlgorithm: -1 })
    .limit(limit)
    .skip(paginated.startIndex)
    .populate("author", "username")
    .populate("subreddit", "subredditName")
    .select("-comments");
  const paginatedPosts = {
    previous: paginated.results.previous,
    results: suscribedPosts,
    next: paginated.results.next,
  };
  res.status(200).json(paginatedPosts);
};

const getSearchedPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const query = req.query.query;

  // query to search posts
  const findQuery = {
    $or: [
      { title: { $regex: query, $options: "i" } },
      { textSubmission: { $regex: query, $options: "i" } },
    ],
  };
  const postsCount = await Post.countDocuments(findQuery);
  const paginated = paginateResults(page, limit, postsCount);
  const searchedPosts = await Post.find(findQuery)
    .limit(limit)
    .skip(paginated.startIndex)
    .populate("author", "username")
    .populate("subreddit", "subredditName")
    .select("-comments");
  const paginatedPosts = {
    previous: paginated.results.previous,
    results: searchedPosts,
    next: paginated.results.next,
  };
  res.status(200).json(paginatedPosts);
};

// Geting post by id and comments
const getPostAndComments = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).send({
      message: `Post with the given ID ${id} was not found`,
    });
    }
    // Querying populated post
  const populatedPost = await post
    .populate("author", "username")
    .populate("subreddit", "subredditName")
    .populate("comments.commentedBy", "username")
    .populate("comments.replies.repliedBy", "username")
        .execPopulate();
    res.status(200).json(populatedPost);
};

// Controller to create a new post
const createNewPost = async (req, res) => {
    const { title, subreddit, postType, textSubmission, imageSubmission, linkSubmission } = req.body;
    
    const validatedFields = postTypeValidator(postType, textSubmission, imageSubmission, linkSubmission);
    const author = await User.findById(req.user);
    const targetSubreddit = await Subreddit.findById(subreddit);

    if (!author) {
        return res.status(404).send({ message: "User not found" });
    }
    if (!targetSubreddit) {
        return res.status(404).send({ message: `Subreddit not found with id ${subreddit}` });
    }
    const newPost = new Post({
        title,
        subreddit,
        author: author._id,
        upvotedBy: [author._id],
        pointsCount: 1,
        ...validatedFields,
    });

    if (postType === 'Image') {
        const uploadedImage = await cloudinary.uploader.upload(
            imageSubmission,
            {
                upload_preset: UPLOAD_PRESET,
            },
            (error) => {
                if (error) return res.status(401).send({ message: error.message });
            }
        );
        newPost.imageSubmission = {
            imageLink = uploadedImage.url,
            imageId = uploadedImage.public_id,
        }
        
    }
    const savedPost = await newPost.save();
    targetSubreddit.posts = targetSubreddit.posts.concat(savedPost._id);
    await targetSubreddit.save();

    author.posts = author.posts.concat(savedPost._id);
    author.karmaPoints.postKarma++;
    await author.save();

    const populatedPost = await savedPost.populate('author', 'username').populate('subreddit', 'subredditName').execPopulate();
    res.status(201).json(populatedPost)
};

module.exports = { getPosts, getSuscribedPosts, getSearchedPosts, getPostAndComments, createNewPost };
