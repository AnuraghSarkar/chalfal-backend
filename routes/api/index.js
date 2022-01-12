import express from "express";
const router = express.Router();

import authRoutes from "./auth";
import postRoutes from "./post";


// auth routes
router.use("/auth", authRoutes);

// post routes
router.use(postRoutes);

export default router;
