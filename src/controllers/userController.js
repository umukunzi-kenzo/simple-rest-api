import User from "../models/users.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";


// register controller
export const registerUser = async (req, res) => {

   try {
      const { username, email, password} = req.body; 

      // basic validation 
      if(!username || !email || !password){
         return res.status(400).json({ message: "Both username,email and password are required"});
      }
      

      //check if the user already exist
      const existingUser =  await User.findOne({ email});
      if(existingUser){
         return res.status(400).json({ message: "A User with this email already exist"});
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);


      // create user
     const user = await User.create({
      username,
      email,
      password:  hashedPassword,
     });

     // generate token
     const token = jwt.sign(
      {id: user._id, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: "7d"}
     )

     res.status(201).json({
      message: "User registerd successfully",
      token,
      user:{
         id:user._id,
         username:user.username,
         email:user.email,
         role:user.role
      }
     });

   } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error"});
      
   }
};




//loggin controller
export const loginUser = async (req, res) => {
   try {
      
      const { email, password } = req.body;
      
      //basic validation
      if(!email || !password){
         return res.status(400).json({ message: "Email and password are required"});
      }

      //compare emails
      const user = await User.findOne({ email})
      if(!user){
         return res.status(400).json({ message: "invalid credentials"});
      }

      // comapare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
         return res.status(400).json({ message: " invalid credentials"});
      }

      //generate a token
      const token = jwt.sign(
         { id: user._id, role: user.role},
         process.env.JWT_SECRET,
         { expiresIn: "7d"}
      );

      //send response
        res.status(200).json({
          message: " login sucessful!",
          token,
          user: {
            id:user._id,
            username:user.username,
            email:user.email,
            role: user.role
          }
         });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error"});
   }
}

//update user controller
export const updateUserProfile = async (req,res) => {
   try {
      const userId = rq.user.id;
      
      
   } catch (error) {
      
   }
}



export default { registerUser, loginUser,  }; 