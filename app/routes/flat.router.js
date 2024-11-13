import { Router } from 'express';
import { getAllFlats, getFlatById, createFlat, updateFlat, deleteFlat } from '../controllers/flat.controller.js';


const router = Router();

// Routes defined for CRUD operations on flats
router.get("/", getAllFlats);

router.get("/:id", getFlatById);

router.post("/", createFlat);//use auth middleware to authorize only flat owners.

router.patch("/:id", updateFlat);//use auth middleware to authorize only flat owners.

router.delete("/:id", deleteFlat);//use auth middleware to authorize only flat owners.

export default router;