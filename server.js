import { connectDB } from "./src/config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5500;

connectDB();

app.listen(PORT,()=>{
    console.log(`Server listening on PORT :${PORT}`);
})
