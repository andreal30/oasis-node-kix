import { Router } from 'express';
import { getMessagesByFLatId, createMessage, deleteMessage } from '../controllers/message.controller.js';

const router = Router();

// Routes defined

router.get("/", getMessagesByFLatId);//use middleware to authorize only flat owners.
router.post("/", createMessage);//use middleware to authorize only flat owners.
router.delete("/:id", deleteMessage);

export default router;