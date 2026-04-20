import mongoose from "mongoose";
import app from "../../app.js";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    console.log("MONGODB_URL:", process.env.MONGODB_URL ? "Found ✓" : "MISSING ✗");
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected successfully!!");
    } catch (err) {
        console.error("DB connection failed!!", err.message);
        process.exit(1);
    }
};
