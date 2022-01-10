import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import routes from "./routes";
import dbConnection from "./config/dbConnection";
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true,
  })
);
app.use(cookieParser());
app.use(cors());

// Connect to MongoDB
dbConnection;


app.use(routes);

app.get("/", (req, res) => {
  res.send("ok");
});
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
