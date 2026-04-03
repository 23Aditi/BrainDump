import User from "../models/Users.js";
import {hashPassword , comparePassword} from "../utils/passwordUtils.js";
import {generateToken} from "../utils/generateToken.js";
import {isValidEmail , isStrongPassword} from "../utils/validators.js";
import crypto from "crypto";
import {sendEmail} from "../utils/emailService.js"

export const register = async(req,res)=>{
    try{
        const {userName, email , password, phoneNo, bio} = req.body;
        if(!userName || !email || !password || !phoneNo){
            return res.status(400).json({
                message : "All frields are required."
            });
        }
        if(!isValidEmail(email)){
            return res.status(400).json({
                message : "Invalid email"
            });
        }
        if(!isStrongPassword(password)){
            return res.status(400).json({
               message : "Password must be of more than 6 characters and must contain one upper case,one lower case and one numeric characrer"
            });
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message : "User already exists"
            });
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            userName,
            email,
            password : hashedPassword,
            phoneNo,
            bio
        });

         // ===== EMAIL VERIFICATION =====
        const verificationToken = crypto.randomBytes(32).toString("hex");

        user.verificationToken = verificationToken;
        user.verificationTokenExpiry = Date.now() + 15 * 60 * 1000;

        await user.save();

        const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;

        // ===== TEXT VERSION =====
        const emailText = `
Dear User,

Thank you for signing up for BrainDump.

BrainDump is designed as a personal developer learning log — a space where you can systematically capture, organize, and revisit the mistakes you encounter while building software.

With BrainDump, you can:

- Record mistakes with clear titles and detailed descriptions
- Document solutions and approaches that worked
- Organize entries using custom categories defined by you
- Add tags for efficient searching and retrieval
- Attach learning resources for future reference
- Track difficulty levels and monitor your progress
- Mark issues as resolved to build a history of learning

To complete your registration, please verify your email address:

${verificationLink}

This link will expire in 15 minutes.

If you did not create an account, you can ignore this email.

Sincerely,  
Team BrainDump
`;

        // ===== HTML VERSION =====
        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email - BrainDump</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px;">
          
          <tr>
            <td style="text-align:center; padding-bottom:20px;">
              <h2 style="margin:0; color:#333;">Welcome to BrainDump</h2>
            </td>
          </tr>

          <tr>
            <td style="color:#555; font-size:15px; line-height:1.6;">
              
              <p>Dear User,</p>

              <p>Thank you for signing up for <strong>BrainDump</strong>.</p>

              <p>
                BrainDump is designed as a personal developer learning log — a space where you can systematically capture, organize, and revisit the mistakes you encounter while building software.
              </p>

              <p><strong>With BrainDump, you can:</strong></p>

              <ul>
                <li>Record mistakes with clear titles and detailed descriptions</li>
                <li>Document solutions and approaches that worked</li>
                <li>Organize entries using custom categories defined by you</li>
                <li>Add tags for efficient searching and retrieval</li>
                <li>Attach learning resources for future reference</li>
                <li>Track difficulty levels and monitor your progress</li>
                <li>Mark issues as resolved to build a history of learning</li>
              </ul>

              <p>To complete your registration, please verify your email:</p>

              <p style="text-align:center; margin:30px 0;">
                <a href="${verificationLink}" 
                   style="background-color:#4CAF50; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:5px; font-weight:bold;">
                   Verify Email
                </a>
              </p>

              <p style="font-size:14px; color:#777;">
                This link will expire in 15 minutes.
              </p>

              <p style="font-size:14px; color:#777;">
                If you did not create an account, you can ignore this email.
              </p>

              <p>
                Sincerely,<br>
                <strong>Team BrainDump</strong>
              </p>

            </td>
          </tr>

        </table>

        <table width="600" style="margin-top:15px;">
          <tr>
            <td style="text-align:center; font-size:12px; color:#999;">
              © 2026 BrainDump. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

        await sendEmail(
            user.email,
            "Verify Your Email - BrainDump",
            emailText,
            emailHTML
        );


        const token = generateToken({id : user._id});
        res.status(201).json({
            success : true,
            message : "User registered",
            data : {
                _id : user._id,
                userName : user.userName,
                email: user.email,
                token,
            },
        });
    }catch(error){
        console.error(error);
        res.status(500).json({message : error.message});
    }
};

export const login = async(req,res)=>{
    try{
        const {email , password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                message : "Email and password are required."
            });
        }
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({
                message : "Invalid credentials."
            });
        }
        const isMatch = await comparePassword(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                message : "Invalid credentials."
            });
        }
        const token = generateToken({id : user._id});
        res.status(200).json({
            success : true,
            message : "Login successful",
            data : {
                _id : user._id,
                userName : user.userName,
                email : user.email , 
                token,
            }
        });

    }catch(error){
        console.error(error);
        res.status(500).json({
            message : error.message
        });
    }
};


// ================= VERIFY EMAIL =================
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};












