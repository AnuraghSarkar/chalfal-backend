const express = require("express");
const { auth } = require("../utils/middleware");

const {
  getUser,
  setuserAvatar,
  removeuserAvatar,
} = require("../controllers/user");

const router = express.Router();
router.get("/:username", getUser);
router.post("/avatar", auth, setuserAvatar);
router.delete("/avatar", auth, removeuserAvatar);

module.exports = router;
