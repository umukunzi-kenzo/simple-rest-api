import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(

{
    username:{
        type:String,
        required: true,
        trim: true
    }, 

    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },

    password:{
        type: String,
        required: true,
        minlength: 6
    },

    role:{
        type:String,
        enum:["user","admin"],
        default: "user"
    }
},

{
    timestamps:true
}

);

const User = mongoose.model("User",UserSchema);

export default User;