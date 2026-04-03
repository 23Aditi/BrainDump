import express from "express";
import {register, login, verifyEmail} from "../controllers/authController.js";

const router = express.Router();

router.get("/verify-email", verifyEmail);
router.post("/register",register);
router.post("/login",login);

export default router;



