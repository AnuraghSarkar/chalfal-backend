const express = require("express");
require("express-async-errors");
const cors = require("cors");
const middleware = require("./utils/middleware");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const subredditRoutes = require("./routes/subreddit");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use("/api", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subreddits", subredditRoutes);
app.use("/api/users", userRoutes);

app.use(middleware.unknownEndpointHandler);
app.use(middleware.errorHandler);

module.exports = app;
