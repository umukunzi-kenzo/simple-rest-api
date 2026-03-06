import express from "express";

import User from "../models/users.js"

import { protect, authorizeAdmin} from "../middlewares/authMiddleware.js";

import {registerUser, loginUser, updateUserProfile } from "../controllers/userController.js";
import { syncIndexes } from "mongoose";

const router = express.Router();

//endpoint for register POST/api/users/register
router.post("/register",registerUser); 

//loggin endpoint POST/api/users/loggin
router.post("/login",loginUser)
 
// to access protected route
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "You have accessed a protected route",
        user: req.user
    });
});


// to access admin only route
router.get("/all-users", protect, authorizeAdmin, async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});


router.put("/update-profile", protect, updateUserProfile);

export default router;