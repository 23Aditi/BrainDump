import express from "express";
import {
    createMistake,
    getAllMistakes,
    getMistake,
    updateMistake,
    deleteMistake
} from "../controllers/mistakesController.js";
import {protect} from "../middleware/authMiddleware.js";


const router = express.Router();

router.use(protect);

router.post("/",createMistake);
router.get("/",getAllMistakes);
router.get("/:id",getMistake);
router.patch("/:id",updateMistake);
router.delete("/:id",deleteMistake);

export default router;

