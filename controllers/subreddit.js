const Subreddit = require('../models/subreddit');
const Post = require('../models/post');
const User = require('../models/user');

const getSubreddits = (req, res) => {
  Subreddit.findOne({ name: req.params.subreddit })
    .then(subreddit => {
      if (!subreddit) {
        res.status(404).json({ message: 'Subreddit not found' });
      } else {
        res.status(200).json(subreddit);
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Internal server error' });
    });
}

module.exports = {getSubreddits};