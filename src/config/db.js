import mongoose from "mongoose";
import app from "../../app.js";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected successfully!!");
    }catch(err){
        console.error(err);
        console.log("DB connection failed!!");
    }
};