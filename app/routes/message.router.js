import { Router } from "express";
import { getAllMessages, getUserMessage, addMessage } from "../controllers/message.controller.js";

const router = Router();

// Routes defined

router.get("/flats/:id", getAllMessages);//use middleware to authorize only flat owners. FLAT Id
router.get("/flats/:id/senderId", getUserMessage);//use middleware to flat sender. SENDER Id review
router.post("/flats/:id", addMessage);

export default router;