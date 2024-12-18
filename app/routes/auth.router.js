import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  // handleGoogleAuth,
} from "../controllers/auth.controller.js";
// import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { getUserById } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/users/:userId", getUserById);
// router.post("/google", handleGoogleAuth);

export default router;
