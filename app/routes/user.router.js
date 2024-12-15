import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  addFlatFavourites,
  removeFlatFavourites,
  allowAdmin,
  denyAdmin,
  validateUnique,
  getFlatsCountForUsers,
} from "../controllers/user.controller.js";
import {
  adminMiddleware,
  ownerUserMiddleware,
} from "./../middlewares/authorization.middleware.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.get("/", authenticationMiddleware, adminMiddleware, getAllUsers); // admin
router.post(
  "/favourite-flat/:flatId",
  authenticationMiddleware,
  addFlatFavourites
);
router.delete(
  "/favourite-flat/:flatId",
  authenticationMiddleware,
  removeFlatFavourites
);
router.patch(
  "/admin/:userId",
  authenticationMiddleware,
  adminMiddleware,
  allowAdmin
);
router.delete(
  "/admin/:userId",
  authenticationMiddleware,
  adminMiddleware,
  denyAdmin
);
router.post("/validate-unique", validateUnique);
router.post("/flats/count", getFlatsCountForUsers);
router.get(
  "/:userId",
  authenticationMiddleware,
  ownerUserMiddleware,
  getUserById
); //admin/account owner*
router.patch(
  "/:userId",
  authenticationMiddleware,
  ownerUserMiddleware,
  updateUser
); //admin/account owner
router.delete(
  "/:userId",
  authenticationMiddleware,
  ownerUserMiddleware,
  deleteUser
); //admin/account owner

export default router;
