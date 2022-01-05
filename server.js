import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors({ origin: "127.0.0.1:3000", credentials: true }));

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

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
