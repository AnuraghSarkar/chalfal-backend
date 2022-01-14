const Subreddit = require('../models/subreddit');
const Post = require('../models/post');
const User = require('../models/user');

// fetching all subreddits
const getSubreddits = (req, res) => {
    const allSubreddits = await Subreddit.find({}).select('id subredditName');
    res.status(200).json(allSubreddits);
}


module.exports = {getSubreddits};