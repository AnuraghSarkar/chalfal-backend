const mongoose = require("mongoose");
const { MONGODB_URI: url } = require("./utils/config");
require("dotenv").config();

const connectToDB = async () => {
  try {
    await mongoose.connect(url, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error(`Error while connecting to MongoDB: `, error.message);
  }
};

module.exports = connectToDB;
