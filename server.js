import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5500;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server listening on PORT: ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
