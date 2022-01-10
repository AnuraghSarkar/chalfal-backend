import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const router = express.Router();
import apiRoutes from "./api";
const apiURL = process.env.API_URL;

const api = `/${apiURL}`;

// api routes
router.use(api, apiRoutes);
router.use(api, (req, res) => res.status(404).json("No API route found"));
export default router;
