const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { SECRET } = require("../utils/config");

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    username: { $regex: new RegExp("^" + username + "$" + "i") },
  });
  if (!user) {
    return res.status(400).send({ message: "User not found" });
  }
};
