import User from "../models/User";
import lodash from "lodash";
import fetch from "node-fetch";
import expressJwt from "express-jwt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
// Custom Error Handler
import errorHandler from "../helpers/dbErrorHandling";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config({ path: "config/.env" });
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const registerController = (req, res) => {
  const { email, username, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          errors: "Email is taken",
        });
      }
    });
    // Generate token
    const token = jwt.sign(
      {
        email,
        username,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "5m",
      }
    );

    //  Email data sender
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account activation link",
      html: `
                <h1>Please use the following to activate your account</h1>
                <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };
    sgMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          errors: errorHandler(err),
        });
      });
  }
};

export default registerController;
