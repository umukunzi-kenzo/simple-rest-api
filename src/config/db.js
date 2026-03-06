import mongoose from "mongoose";

const connectDB  = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`We are connected to mongoDB through ${conn.connection.host}`);
        
    } catch (error) {
        
        console.log("error connecting to mongoDB", error.message);
    }
};

export default connectDB;
