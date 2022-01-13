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
  return res
    .status(200)
    .json({
      token,
      username: user.username,
      id: user._id,
      avatar: user.avatar,
      karma: user.karmaPoints.postKarma + user.karmaPoints.commentKarma,
    });
};
