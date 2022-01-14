const Post = require("../models/post");
const User = require("../models/user");
const numOfComments = require("../models/numOfComments");

const postComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  // Checking if comment is empty
  if (!comment) {
    return res.status(400).send({ message: `Comment can't be empty.` });
  }

  // fetching post
  const post = await Post.findById(id);
  // fetching user
  const user = await User.findById(req.user);
  // Checking if post exists
  if (!post) {
    return res.status(404).send({ message: `Post with ID:${id} not found.` });
  }
  // Checking if user exists
  if (!user) {
    return res.status(404).send({ message: `User not found.` });
  }

  // Creating comment
  post.comments = post.comments.concat({
    commentedBy: user._id,
    commentBody: comment,
    upvotedBy: [user._id],
    pointsCount: 1,
  });
    // Counting number of comments
    post.commentCount = numOfComments(post.comments);
    // Saving post\
    const savedPost = await post.save();
    // Populating post with user
    const populatedPost = await savedPost.populate("comments.commentedBy", 'username').execPopulate();
    // Couting karma
    user.karmaPoints.commentKarma++;
    await user.save();
    // Sending response
    const addedComment = populatedPost.comments[savedPost.comments.length - 1];
    res.status(201).json({addedComment});
};

const deleteComment = async (req, res) => { };

module.exports = { postComment, deleteComment };
