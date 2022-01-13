const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { SECRET } = require("../utils/config");

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  // Store the user in a variable
  const user = await User.findOne({
    username: { $regex: new RegExp("^" + username + "$" + "i") },
  });
  // Check if user exists
  if (!user) {
    return res.status(400).send({ message: "User not found" });
  }
  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).send({ message: "Invalid password" });
  }
  // Create a token
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET);
  // Send the token
  return res.status(200).json({
    token,
    username: user.username,
    id: user._id,
    avatar: user.avatar,
    karma: user.karmaPoints.postKarma + user.karmaPoints.commentKarma,
  });
};

const signUpUser = async (req, res) => {
  const { username, password } = req.body;
  // Validate the form
  if (!username || !password) {
    return res.status(400).send({ message: "Please enter all fields" });
  }
  if (!password || password.length < 6) {
    return res
      .status(400)
      .send({ message: "Password must be at least 6 characters" });
  }
  if (!username || username.length < 3 || username.length > 20) {
    return res
      .status(400)
      .send({ message: "Username must be between 3 and 20 characters" });
  }
  // Check if user exists
  const existingUser = await User.findOne({
    username: { $regex: new RegExp("^" + username + "$" + "i") },
  });
  if (existingUser) {
    return res.status(400).send({ message: `${username} user already exists` });
  }
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  // Create the user
  const user = new User({ username, passwordHash });
  const savedUser = await user.save();
  // Create a token
  const payload = {
    id: savedUser._id,
  };
  const token = jwt.sign(payload, SECRET);
  // Send the token
  res
    .status(200)
    .json({
      token,
      username: savedUser.username,
      id: savedUser._id,
      avatar: savedUser.avatar,
      karma: 0,
    });
};
