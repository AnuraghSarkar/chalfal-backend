const Post = require('../models/post');
const User = require('../models/user');
const numOfComments = require('../models/numOfComments');

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
};

module.exports = {postComment};