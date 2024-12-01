import { Router } from "express";
import { getAllMessages, getUserMessage, addMessage } from "../controllers/message.controller.js";
import { authenticateUser, flatOwnerMiddleware, ownerUserMiddleware } from "../middlewares/authorization.middleware.js";

const router = Router();

// Routes defined

router.get("/flats/:flatId", authenticateUser, flatOwnerMiddleware, getAllMessages);
router.get("/flats/:flatId/sender/:senderId", authenticateUser, ownerUserMiddleware, getUserMessage);
router.post("/flats/:flatId/sender", authenticateUser, addMessage);

export default router;