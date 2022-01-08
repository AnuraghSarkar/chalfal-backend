require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");

const keys = require("./config/keys");
// const webpackConfig = require('../webpack.config');
const routes = require("./routes");

const { database, port } = keys;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true,
  })
);
app.use(cors());

// Connect to MongoDB
mongoose.set("useCreateIndex", true);
mongoose
  .connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Mongo connected`))
  .catch((err) => console.log(err));

require("./config/passport")(app);
app.use(routes);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

