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
const createNewSubreddit = async (req, res) => {
  const { subredditName, description } = req.body;
  const admin = await User.findById(req.user);
  // checking if user already exists
  if (!admin) {
    return res.status(404).send({ message: "User not found" });
  }
  // checking if subreddit already exists
  const existingSubName = await Subreddit.findOne({
    subredditName: { $regex: new RegExp("^" + subredditName + "$", "i") },
  });
  // if subreddit exists
  if (existingSubName) {
    return res.status(400).send({
      message: `Subreddit named ${subredditName} already exists. Please choose another name.`,
    });
  }
  // creating new subreddit
  const newSubreddit = new Subreddit({
    subredditName,
    description,
    admin: admin._id,
    suscribedBy: [admin._id],
    subscriberCount: 1,
  });
  // saving new subreddit
  const savedSubreddit = await newSubreddit.save();
  // adding admin as a suscribed user
  admin.subscribedSubs = admin.subscribedSubs.concat(savedSubreddit._id);
  await admin.save();
  // sending response
  res.status(201).json(savedSubreddit);
};
// editing a subreddit
const editSubDescription = async (req, res) => {
  const { description } = req.body;
  const { id } = req.params;
  // checking if description is empty
  if (!description) {
    return res.status(400).send({ message: "Description cannot be empty" });
  }
  // finding subreddit and admin
  const subreddit = await Subreddit.findById(id);
  const admin = await User.findById(req.user);
  // checking if admin is empty
  if (!admin) {
    return res.status(404).send({ message: "User not found" });
  }
  // checking if subreddit is empty
  if (!subreddit) {
    return res
      .status(404)
      .send({ message: `Subreddit with id ${id} not found` });
  }

  // checking if admin is the owner of the subreddit
  if (subreddit.admin.toString() !== admin._id.toString()) {
    return res
      .status(403)
      .send({ message: "You are not the owner of this subreddit" });
  }
  // updating subreddit
  subreddit.description = description;
  await subreddit.save();

  // sending response
  res.status(200).end();
};

// deleting a subreddit
const deleteSubreddit = async (req, res) => {
  const { id } = req.params;
  // finding subreddit and admin
  const subreddit = await Subreddit.findById(id);
  const admin = await User.findById(req.user);
  // checking if admin is empty
  if (!admin) { 
    return res.status(404).send({ message: "User not found" });
  }
  // checking if subreddit is empty
  if (!subreddit) { 
    return res
      .status(404)
      .send({ message: `Subreddit with id ${id} not found` });
  }
  // checking if admin is the owner of the subreddit
  if (subreddit.admin.toString() !== admin._id.toString()) { 
    return res
      .status(403)
      .send({ message: "You are not the owner of this subreddit" });
  }
  // deleting subreddit
  await subreddit.remove();
  // sending response
  res.status(200).end();
 };

// being  subscribers
const subscribeToSubreddit = async (req, res) => {
  const { id } = req.params;
  const subreddit = await Subreddit.findById(id);
  const user = await User.findById(req.user);
  // checking if user is empty
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  // checking if subreddit is already subscribed
  if (subreddit.subscribedBy.includes(user._id.toString())) {
    subreddit.subscribedBy = subreddit.subscribedBy.filter(
      (s) => s.toString() !== user._id.toString()
    );

    user.subscribedSubs = user.subscribedSubs.filter(
      (s) => s.toString() !== subreddit._id.toString()
    );
  } else {
    subreddit.subscribedBy = subreddit.subscribedBy.concat(user._id);

    user.subscribedSubs = user.subscribedSubs.concat(subreddit._id);
  }

  subreddit.subscriberCount = subreddit.subscribedBy.length;

  await subreddit.save();
  await user.save();

  res.status(201).end();
};
module.exports = {
  getSubreddits,
  getSubredditPosts,
  getTopSubreddits,
  createNewSubreddit,
  editSubDescription,
  subscribeToSubreddit,
};
