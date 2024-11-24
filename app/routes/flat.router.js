import { Router } from "express";
import { getAllFlats, getFlatById, addFlat, updateFlat, deleteFlat, addFlats } from "../controllers/flat.controller.js";
//import { authorizeFlatOwner } from "../middleware/auth.middleware.js";

const router = Router();

// Routes defined for CRUD operations on flats
router.get("/", getAllFlats);

router.get("/:id", getFlatById);

router.post("/", addFlat);//use auth middleware to authorize only flat owners.

router.patch("/:id", updateFlat);//use auth middleware to authorize only flat owners.

router.delete("/:id", deleteFlat);//use auth middleware to authorize only flat owners.

router.post("/bulk", addFlats);//use auth middleware to authorize only flat owners.

export default router;