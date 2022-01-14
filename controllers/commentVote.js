const Post = require("../models/post");
const User = require("../models/user");

const upvoteComment = async (req, res) => {
  const { id, commentId } = req.params;
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
  // targetting comment
  const targetComment = post.comments.find(
    (comment) => comment._id.toString() === commentId.toString()
  );
  // checking if comment is empty
  if (!targetComment) {
    return res
      .status(404)
      .send({ message: `Comment with id ${commentId} not found` });
  }
  // checking if user is the comment owner
  const commentAuthor = await User.findById(targetComment.commentedBy);
  if (!commentAuthor) {
    return res.status(404).send({ message: "Comment Author not found" });
  }
  if (targetComment.upvotedBy.includes(user._id.toSring())) {
    targetComment.upvotedBy = targetComment.upvotedBy.filter(
      (upvotedBy) => upvotedBy.toString() !== user._id.toString()
    );
    commentAuthor.karmaPoints.commentKarma--;
  } else {
    targetComment.upvotedBy = targetComment.upvotedBy.concat(user._id);
    targetComment.downvotedBy = targetComment.downvotedBy.filter(
      (d) => d.toString() !== user._id.toString()
    );
    commentAuthor.karmaPoints.commentKarma++;
  }

  // points calculation
  targetComment.pointsCount =
    targetComment.upvotedBy.length - targetComment.downvotedBy.length;
  post.comments = post.comments.map((comment) => {
    comment._id.toString() !== commentId ? comment : targetComment;
  });
    // saving changes
    await post.save();
    await commentAuthor.save();
    res.status(200).end();
};

// downvote comment
const downvoteComment = async (req, res) => { };

module.exports = { upvoteComment, downvoteComment };
