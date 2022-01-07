import User from "../models/User";
import lodash from "lodash";
import fetch from "node-fetch";
import expressJwt from "express-jwt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";


exports.registerController = (req, res) => {
  const { email, username, password } = req.body;
};
