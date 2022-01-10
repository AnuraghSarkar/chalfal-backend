import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbConnection = await mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("database connected.");
  })
  .catch((err) => console.log(err.message));
export default dbConnection;