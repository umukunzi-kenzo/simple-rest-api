import express from "express";

import User from "../models/users.js"

import { protect, authorizeAdmin} from "../middlewares/authMiddleware.js";

import {registerUser, loginUser, updateUserProfile,deleteUserProfile, deleteUserByAdmin, updateUserByAdmin  } from "../controllers/userController.js";


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

//update user route
router.put("/update-profile", protect, updateUserProfile );


// account deletion  
router.delete("/profile",protect, deleteUserProfile); 


// delete user by admin
router.delete("/:id", protect, authorizeAdmin, deleteUserByAdmin);

// uodate user by admin
router.put("/:id",protect,authorizeAdmin,updateUserByAdmin)


export default router;