import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import jwt from "jsonwebtoken";

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

await mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("database connected.");
  })
  .catch((err) => console.log(err.message));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  const { email, username, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const user = new User({ email, username, password: hashPassword });
  user
    .save()
    .then(() => {
      res.sendStatus(201);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
