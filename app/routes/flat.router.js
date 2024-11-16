import { Router } from 'express';
import { getAllFlats, getFlatById, addFlat, updateFlat, deleteFlat } from '../controllers/flat.controller.js';


const router = Router();

// Routes defined for CRUD operations on flats
router.get("/flats", getAllFlats);

router.get("/flats/:id", getFlatById);

router.post("/flats", addFlat);//use auth middleware to authorize only flat owners.

router.patch("/flats/:id", updateFlat);//use auth middleware to authorize only flat owners.

router.delete("/flats/:id", deleteFlat);//use auth middleware to authorize only flat owners.

export default router;