import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique: true,
        trim : true,
        lowercase: true
    },
    password : {
        type: String,
        required : true,
        select : false
    },
    phoneNo : {
        type : String,
        required : true,
    },
    bio : {
        type : String,
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    verificationToken : String,
    verificationTokenExpiry : Date,
    createdAt : {
        type : Date,
        default : Date.now,
    }
});


const User = mongoose.model("User",userSchema);
export default User;