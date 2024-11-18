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

const router = Router();

router.get("/", adminMiddleware, getAllUsers); // admin
router.get("/:id", adminMiddleware, getUserById); //admin/account owner*
router.patch("/:id", adminMiddleware, ownerUserMiddleware, updateUser); //admin/account owner
router.delete("/:id", adminMiddleware, ownerUserMiddleware, deleteUser); //admin/account owner

export default router;
