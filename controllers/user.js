const User = require("../models/user");
const Post = require("../models/post");


const getUser = async (req, res) => {
  const { username } = req.params;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  // Getting User
  const user = await User.findOne({
    username: { $regex: new RegExp("^" + username + "$", "i") },
  });
    // If user not found
    if (!user) { 
        return res.status(404).send({ message: "User not found" });
    }
};

module.exports = {getUser};