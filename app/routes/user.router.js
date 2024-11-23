import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import {
  adminMiddleware,
  ownerUserMiddleware,
} from "../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.get("/", authenticationMiddleware, adminMiddleware, getAllUsers); // admin
router.get("/:id", authenticationMiddleware, adminMiddleware, getUserById); //admin/account owner*
router.patch(
  "/:userId",
  authenticationMiddleware,
  adminMiddleware,
  ownerUserMiddleware,
  updateUser
); //admin/account owner
router.delete(
  "/:userId",
  authenticationMiddleware,
  adminMiddleware,
  ownerUserMiddleware,
  deleteUser
); //admin/account owner

export default router;
