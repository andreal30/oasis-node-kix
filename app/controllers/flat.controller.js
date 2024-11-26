import Flat from "../models/flat.model.js";
import logger from "../utils/logger.js";
//GET ALL FLATS
const getAllFlats = async (req, res) => {
    try {
        logger.info("flats obtained")
        const flats = await Flat.find();
        res.status(200).json(flats);
    } catch (error) {
        logger.error("Error fetching flats", error.message);
        res.status(500).json({ message: error.message });
    }
};
//GET FLAT BY ID
const getFlatById = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info(`Fetching flat with ID: ${id}`);

        // Find flat by ID
        const flat = await Flat.findById(id);

        if (!flat) {
            logger.warn(` ID not found: ${id}`);
            return res.status(404).json({ message: "Flat not found" });
        }

        // Log and respond with the found flat
        logger.info(`Flat found with ID: ${id}`);
        return res.status(200).json(flat);


    } catch (error) {
        logger.error(`Error finding flat with ID ${req.params.id}: ${error.message}`);
        return res.status(500).json({ error: "Failed to obtain flat. Please try again later." });
    }
};
//ADD NEW FLAT
const addFlat = async (req, res) => {
    try {

        const newFlat = new Flat(req.body);
        const savedFlat = await newFlat.save();

        logger.info(`Created new flat with id: ${savedFlat._id}`);
        res.status(201).json(savedFlat);

    } catch (error) {
        logger.error('Error creating flat:', error.message);
        res.status(500).json({ message: error.message });
    }
};
//ADD SEVEAL FLATS AT A TIME !!!! delete for production
const addFlats = async (req, res) => {
    try {
        const newFlats = await Flat.insertMany(req.body);
        logger.info(`Created ${newFlats.length} new flats`);
        res.status(201).json(newFlats);
    } catch (error) {
        logger.error('Error creating flats:', error.message);
        res.status(500).json({ message: error.message });
    }
};
//UPDATE FLAT
const updateFlat = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFlat = await Flat.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFlat) {
            logger.warn(`Flat not found for update with ID: ${id}`);
            return res.status(404).json({ message: "Flat not found" });
        }
        return res.status(200).json(updatedFlat);
    } catch (error) {
        logger.error(`Error updating flat ${req.params.id}:`, error.message);
        res.status(500).json({ message: error.message });
    }
};
//DELETE FLAT
const deleteFlat = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFlat = await Flat.findByIdAndDelete(id);
        if (!deletedFlat) {
            logger.warn(`Flat not found for deletion: ${req.params.id}`);
            return res.status(404).json({ message: 'Flat not found' });
        }

        logger.info(`Deleted flat: ${id}`);
        res.status(200).json({ message: 'Flat deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting flat ${req.params.id}: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export { getAllFlats, getFlatById, addFlat, updateFlat, deleteFlat, addFlats };
