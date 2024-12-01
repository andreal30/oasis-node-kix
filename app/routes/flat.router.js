import { Router } from "express";
import {
  getAllFlats,
  getFlatById,
  addFlat,
  updateFlat,
  deleteFlat,
  addFlats,
} from "../controllers/flat.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { flatOwnerMiddleware } from "../middlewares/authorization.middleware.js";
//import { authorizeFlatOwner } from "../middleware/auth.middleware.js";

const router = Router();

// Routes defined for CRUD operations on flats
//public routes
router.get("/", authenticationMiddleware, getAllFlats);

router.get("/:id", authenticationMiddleware, getFlatById);

router.post("/", authenticationMiddleware, addFlat);

router.patch(
  "/:flatId",
  authenticationMiddleware,
  flatOwnerMiddleware,
  updateFlat
);

router.delete(
  "/:flatId",
  authenticationMiddleware,
  flatOwnerMiddleware,
  deleteFlat
);

router.post("/bulk", authenticationMiddleware, flatOwnerMiddleware, addFlats);

export default router;
