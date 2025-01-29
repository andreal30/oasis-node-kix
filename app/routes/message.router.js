import { Router } from "express";
import {
  getAllMessages,
  getUserMessage,
  addMessage,
} from "../controllers/message.controller.js";
import {
  flatOwnerMiddleware,
  ownerUserMiddleware,
} from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

// Routes defined

router.get(
  "/flats/:flatId",
  authenticationMiddleware,
  flatOwnerMiddleware,
  getAllMessages
);
router.get(
  "/flats/:flatId/sender/:senderId",
  authenticationMiddleware,
  ownerUserMiddleware,
  getUserMessage
);
router.post("/flats/:flatId/sender", authenticationMiddleware, addMessage);

router.get('/:flatId/messages', getAllMessages);
router.get('/:flatId/messages/:senderId', getUserMessage);
router.post('/:flatId/messages', addMessage);

export default router;
