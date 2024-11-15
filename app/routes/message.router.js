import { Router } from 'express';
import { getAllMessages, getUserMessage, addMessage } from '../controllers/message.controller.js';

const router = Router();

// Routes defined

router.get("/flats/:id/messages", getAllMessages);//use middleware to authorize only flat owners. FLAT Id
router.get("/flats/:id/messages/senderId", getUserMessage);//use middleware to flat sender. SENDER Id
router.post("/flats/:id/message", addMessage);

export default router;