import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import { protect } from "./src/middleware/authMiddleware.js";
import userRoutes from "./src/routes/userRoutes.js";
import mistakesRoutes from "./src/routes/mistakesRoutes.js";


const app = express();
dotenv.config();

app.use(cors());
app.use(json());
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
// app.get("/api/test", protect, (req, res) => {
//     res.json({
//         message: "Protected route accessed",
//         user: req.user,
//     });
// });
app.use("/api/mistakes",mistakesRoutes);

export default app;


