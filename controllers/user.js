const User = require("../models/user");
const Post = require("../models/post");
const { cloudinary, UPLOAD_PRESET } = require("../utils/config");

const paginateResults = require("../utils/paginateResults");

const getUser = async (req, res) => {
  const { username } = req.params;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  // Getting User
  const user = await User.findOne({
    username: { $regex: new RegExp("^" + username + "$", "i") },
  });
  // If user not found
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  const postsCount = await Post.countDocuments({ author: user._id });
  const paginatedResults = await paginateResults({ page, limit, postsCount });
  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .select("-comments")
    .limit(limit)
    .skip(paginatedResults.startIndex)
    .populate("author", "username");
};

module.exports = { getUser };
