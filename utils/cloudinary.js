import cloudinary from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: mycloudinary.cloud_name,
  api_key: mycloudinary.api_key,
  api_secret: mycloudinary.api_secret,
});

export default cloudinary;
