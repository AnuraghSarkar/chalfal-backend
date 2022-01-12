import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

router.get("/posts", (req, res) => { 
    res.send("Hello World");
});

export default router;
