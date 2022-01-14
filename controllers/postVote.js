const Post = require("../models/post");
const User = require("../models/user");
const pointsCalculator = require("../utils/pointsCalculator");

const upvotePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  const user = await User.findById(req.user);
  // checking if user is empty
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  // checking if post is empty
  if (!post) {
    return res.status(404).send({ message: `Post with id ${id} not found` });
  }
  // checking if user is the owner of the post
  const author = await User.findById(post.author);
  if (!author) {
    return res.status(404).send({ message: "Author user not found" });
  }
  if (post.upvotedBy.includes(user._id.toString())) {
    post.upvotedBy = post.upvotedBy.filter(
      (auth) => auth.toString() !== user._id.toString()
    );
    author.karmaPoints.postKarma++;
  } else {
    post.upvotedBy = post.upvotedBy.concat(user._id);
    post.downvotedBy = post.downvotedBy.filter(
      (auth) => auth.toString() !== user._id.toString()
    );
    author.karmaPoints.postKarma++;
  }

  // calcualting points
  const calculatedData = pointsCalculator(
    post.upvotedBy.length,
    post.downvotedBy.length,
    post.createdAt
  );
  post.pointsCount = calculatedData.pointsCount;
  post.voteRatio = calculatedData.voteRatio;
  post.hotAlgorithm = calculatedData.hotAlgorithm;
  post.controversialAlgorithm = calculatedData.controversialAlgorithm;

  // saving post
  await post.save();
  await author.save();
  res.status(201).end();
};

module.exports = upvotePost;
