import User from "../models/Users.js";
import Mistake from "../models/Mistakes.js";
import {hashPassword, comparePassword} from "../utils/passwordUtils.js";
import {isStrongPassword} from "../utils/validators.js";

export const getProfile = async(req,res)=>{
    try{
        const user = req.user;
        res.status(200).json({
            success : true,
            data : {
                _id : user._id,
                userName : user.userName,
                email : user.email,
                phoneNo : user.phoneNo,
                bio : user.bio,
                isVerified : user.isVerified,
                createdAt : user.createdAt,
            },
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : error.message
        });
    }
};

export const updateProfile = async(req,res)=>{
    try{
        const {userName,bio,phoneNo} = req.body;
        if(!userName && !bio && !phoneNo){
            return res.status(400).json({
                message : "Nothing to update."
            });
        }  
        const user = req.user;
        if(userName) user.userName = userName;
        if(bio) user.bio = bio;
        if(phoneNo) user.phoneNo = phoneNo;

        await user.save();
        res.status(200).json({
            success : true,
            message : "Profile updated successfully.",
            data : {
                _id : user._id,
                userName : user.userName,
                email : user.email,
                phoneNo : user.phoneNo,
                bio : user.bio,
            },
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : error.message
        });
    }
};

export const changePassword = async(req,res)=>{
    try{
        const {oldPassword, newPassword} = req.body;
        if(!oldPassword && !newPassword){
            res.status(400).json({
                message :"Old and new password is required."
            });
        }
        const isStrong = isStrongPassword(newPassword);
        if(!isStrong){
            res.status(400).json({
                message : "Enter a strong password."
            });
        }
        const user = await User.findById(req.user._id).select("+password");
        const isMatch = await comparePassword(oldPassword,user.password);
        if(!isMatch){
            return res.status(400).json({
                message : "Old password is incorrect."
            });
        }
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            success : true,
            message : "Password changed successfully."
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : error.message
        });
    }
};

export const deleteUser = async (req,res)=>{
    try{
        const userId = req.user._id;
        await Mistake.deleteMany({userId});
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            success : true,
            message : "User deleted successfully."
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : error.message
        });
    }
};






