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
  const populatedPost = await savedPost
    .populate("comments.commentedBy", "username")
    .execPopulate();
  // Couting karma
  user.karmaPoints.commentKarma++;
  await user.save();
  // Sending response
  const addedComment = populatedPost.comments[savedPost.comments.length - 1];
  res.status(201).json({ addedComment });
};

const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
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
  // Targeting comment
  const targetComment = post.comments.find(
    (comment) => comment._id.toString() === commentId
  );
  // Checking if comment exists
  if (!targetComment) {
    return res
      .status(404)
      .send({ message: `Comment with ID:${commentId} not found.` });
  }
  // Checking if user is the owner of the comment
  if (targetComment.commentedBy.toString() !== user._id.toString()) {
    return res
      .status(401)
      .send({ message: `You are not the owner of the comment.` });
  }
  // Removing comment
  post.comments = post.comments.filter(
    (comment) => comment._id.toString() !== commentId
  );
  // Counting number of comments
  post.commentCount = numOfComments(post.comments);
  // Saving post
  await post.save();
  res
    .status(204)
    .json({ message: `Comment with ID:${commentId} deleted.` })
    .end();
};

// updating comment
const updateComment = async (req, res) => {
  const { id, commentId } = req.params;
  const { comment } = req.body;
  // validating comment
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
  // Targeting comment
  const targetComment = post.comments.find(
    (comment) => comment._id.toString() === commentId
  );
  // Checking if comment exists
  if (!targetComment) {
    return res
      .status(404)
      .send({ message: `Comment with ID:${commentId} not found.` });
  }
  // Checking if user is the owner of the comment
  if (targetComment.commentedBy.toString() !== user._id.toString()) {
    return res
      .status(401)
      .send({ message: `You are not the owner of the comment.` });
  }
  // Updating comment
  targetComment.commentBody = comment;
  targetComment.updatedAt = Date.now();
  // Saving post
  post.comments = post.comments.map((comment) => {
    comment._id.toString() !== commentId ? comment : targetComment;
  });
  await post.save();
  res.status(202).json({ message: `Comment updated.` }).end();
};
// post reply
const postReply = async (req, res) => {
  const { id, commentId } = req.params;
  const { reply } = req.body;
  // validating reply
  if (!reply) {
    return res.status(400).send({ message: `Reply can't be empty.` });
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
  // Targeting comment
  const targetComment = post.comments.find(
    (comment) => comment._id.toString() === commentId
  );
  // Checking if comment exists
  if (!targetComment) {
    return res
      .status(404)
      .send({ message: `Comment with ID:${commentId} not found.` });
  }
  //    repllies of target comment
  targetComment.replies = targetComment.replies.concat({
    replyBody: reply,
    repliedBy: user._id,
    upvotedBy: [user._id],
    pointsCount: 1,
  });
  // Counting number of replies
  post.comments = post.comments.map((comment) => {
    comment._id.toString() !== commentId ? comment : targetComment;
  });
  post.commentCount = numOfComments(post.comments);
  // Saving post
  const savedPost = await post.save();
  // Populating post with user
  const populatedPost = await savedPost
    .populate("comments.replies.repliedBy", "username")
    .execPopulate();
  // Couting karma
  user.karmaPoints.commentKarma++;
  user.totalComments++;
  await user.save();
  // Sending response
  const commentToReply = populatedPost.comments.find(
    (comment) => comment._id.toString() === commentId
  );
  const addedReply = commentToReply.replies[commentToReply.replies.length - 1];
  res.status(201).json(addedReply);
};

module.exports = { postComment, deleteComment, updateComment, postReply };
