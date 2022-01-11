import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import validator from "validator";
// Bring in Models & Helpers

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  // validate user data
  const duplicateEmail = await User.findOne({ email });
  const duplicateUsername = await User.findOne({ username });

  if (duplicateEmail) {
    return res.status(400).json({
      err: "Email Already Exists",
    });
  }
  if (duplicateUsername) {
    return res.status(400).json({
      err: "Username Already Exists",
    });
  }
  if (!email || !username || !password) {
    return res.status(400).json({
      err: "Please fill in all fields",
    });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      err: "Please enter a valid email",
    });
  }
  if (username.length < 6) {
    return res.status(400).json({
      err: "Username must be at least 6 characters long",
    });
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({
      err: "Password must be at least 8 characters long containing at least 1 number and 1 symbol",
    });
  }
  const hashPassword = bcrypt.hashSync(password, 10);
  const user = new User({ email, username, password: hashPassword });
  await user
    .save()
    .then((user) => {
      jwt.sign({ id: user._id }, process.env.JWT_SECRET, (err, token) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res
            .status(201)
            .cookie("token", token)
            .json({ success: "User created successfully" });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

const getUserFromToken = (token) => {
  const userInfo = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(userInfo.id);
};

router.get("/user", (req, res) => {
  const token = req.cookies.token;

  getUserFromToken(token)
    .then((user) => {
      res.json({ username: user.username, avatar: user.avatar });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }).then((user) => {
    if (user && user.username) {
      const passOk = bcrypt.compareSync(password, user.password);
      if (passOk) {
        jwt.sign({ id: user._id }, process.env.JWT_SECRET, (err, token) => {
          res
            .cookie("token", token)
            .json({ success: "User logged in successfully" });
        });
      } else {
        res.status(422).json({ err: "Invalid username or password" });
      }
    } else {
      res.status(422).json({ err: "Invalid username or password" });
    }
  });
});

router.post("/logout", (req, res) => {
  res.cookie("token", "").send();
});

export default router;
