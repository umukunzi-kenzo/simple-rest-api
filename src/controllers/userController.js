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
      
      const userId = req.user.id;
      const {username, email, password} = req.body;

      // find user in db
      const user = await User.findById(userId);

      if(!user){
         return res.status(404).json({ message: "user not found"});

      }

      // update user if feilds are provided
      if(username) user.username = username;
      if(email) user.email = email;

      // hash paaword if provided;
      if(password){
         const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(password, salt);
      }

      // save updated user
      const updatedUser = await  user.save();

      // return  updated info with no password
      res.status(200).json({
         message: "profile updated",
         id: updatedUser._id,
         username: updatedUser.username,
         email: updatedUser.email,
         role: updatedUser.role,
      });
      
      
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Se rver error"})
   }
}


// delete logged-in user's own account
export const  deleteUserProfile = async (req,res) => {

   try {
      const  userId = req.user.id;
      const user = await User.findById(userId);

      if(!user){
         return res.status(404).json({ message: "User not found"});
      }
       // delete user
      await User.findByIdAndDelete();

      res.status(200).json({ message: "Your account has been deleted successfully"});

   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error "})
   }
}




// admin deletes any user(but can not delete themselves)

export const deleteUserByAdmin = async ( req, res) => {
   try {
      const userId = req.params.id;

      //to prevent admin to delete themselves
      if(req.user.id === userId) {
         return res.status(400).json({ message: "Admin can not delete their own account"});


         // check if user exist
         const user = await User.findById(userId);

        if(!user){
         return res.status(404).json({ message: " User not found"});
        }
      }
      //  delete user 
      await User.findByIdAndDelete(userId);

      res.status(200).json({ message: " user deleted successfully by admin"});
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error"});
   }
};

export const updateUserByAdmin = async(req, res) =>{
   try {
      
      const userId = req.params.id;

      const { username, email, role } = req.body;

      const user = await User.findById(userId);

      if(!user){
         return res.status(404).json({ messsage: " User not found"});
           };

           //update feilds if only if provided
             
            user.username = username || user.username;
            user.email = email || user.email;

            //only allow valid roles
            if(role && ["user", "admin"].includes(role)){
               user.role = role;
            };

            //save updated user

            const updatedUser = await user.save();
            
            res.status(200).json({ 
               message: "user updated by admin successfully",
               user: {
                  id: updatedUser._id,
                  username: updatedUser.username,
                  email: updatedUser.email,
                  role: updatedUser.role
               }
            });


   } catch (error) {
   console.error(error)
   return res.status(500).json({ message: "Server error"})
   }
};



export default { registerUser, loginUser, updateUserProfile, deleteUserProfile, deleteUserByAdmin, updateUserByAdmin }; 