import express from 'express';
const router = express.Router();

// Load COnstructor
import registerController from "../controllers/authController.js";
router.post("/register", registerController);
export default router;