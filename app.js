import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/url";
import bodyParser from "body-parser";
import dbConnection from "./config/dbConnection";
const app = express();


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Connect to MongoDB
dbConnection;


app.use(routes);

app.get("/", (req, res) => {
  res.send("ok");
});
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
