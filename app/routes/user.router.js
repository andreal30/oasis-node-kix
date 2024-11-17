import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  saveUser,
  updateUser,
} from "../controllers/user.controller.js";

// * /users GET -> / GET -> getAllUsers
// * /users/:id GET -> /:id GET -> getUserById
// * /users/:id PATCH  -> / PATCH -> updateUser
// * /users/:id DELETE -> / DELETE -> deleteUser

const router = Router();

router.get("/", getAllUsers);
router.post("/", saveUser);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
