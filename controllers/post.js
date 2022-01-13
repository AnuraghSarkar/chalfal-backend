const Post = require("../models/post");
const User = require("../models/user");
const { cloudinary, UPLOAD_PRESET } = require("../utils/config");
const Subreddit = require("../models/subreddit");

const getPosts = async (req, res) => { };

module.exports = { getPosts };