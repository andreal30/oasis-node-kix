import Flat from "../models/flat.model.js";
import logger from "../utils/logger.js";
//GET ALL FLATS
const getAllFlats = async (req, res) => {
  try {
    if (!req.user) {
      logger.warn("Unauthorized access attempt to get all flats");
      return res.status(401).json({ message: "Login or Create Account" });
    }

    logger.info("Flats obtained by user:", req.user.user_id);
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
    if (!req.user) {
      logger.warn("Unauthorized access attempt to get flat by ID");
      return res.status(401).json({ message: "Login or Create Account" });
    }

    const { id } = req.params;
    logger.info(`Fetching flat with ID: ${id} by user: ${req.user.user_id}`);

    // Find flat by ID
    const flat = await Flat.findById(id);

    if (!flat) {
      logger.warn(`Flat not found with ID: ${id}`);
      return res.status(404).json({ message: "Flat not found" });
    }

    // Log and respond with the found flat
    logger.info(`Flat found with ID: ${id}`);
    return res.status(200).json(flat);
  } catch (error) {
    logger.error(
      `Error finding flat with ID ${req.params.id}: ${error.message}`
    );
    return res
      .status(500)
      .json({ error: "Failed to obtain flat. Please try again later." });
  }
};
//ADD NEW FLAT

const addFlat = async (req, res) => {
  try {
    const flatData = {
      ...req.body,
      ownerId: req.user.user_id,
    };

    const newFlat = new Flat(flatData);
    const savedFlat = await newFlat.save();

    logger.info(`Created new flat with id: ${savedFlat._id}`);
    res.status(201).json(savedFlat);
  } catch (error) {
    logger.error("Error creating flat:", error.message);
    res.status(500).json({ message: error.message });
  }
};

//ADD SEVEAL FLATS AT A TIME !!!! delete for prod
const addFlats = async (req, res) => {
  try {
    const newFlats = await Flat.insertMany(req.body);
    logger.info(`Created ${newFlats.length} new flats`);
    res.status(201).json(newFlats);
  } catch (error) {
    logger.error("Error creating flats:", error.message);
    res.status(500).json({ message: error.message });
  }
};
//UPDATE FLAT

const updateFlat = async (req, res) => {
  try {
    const { flatId } = req.params;

    const updatedFlat = await Flat.findByIdAndUpdate(
      flatId,
      { updated: new Date(), ...req.body }, // Set the 'deleted' field to the current date
      { new: true, runValidators: true } // Options for returning the updated document
    );
    if (!updatedFlat) {
      logger.warn(`Flat not found for update with ID: ${flatId}`);
      return res.status(404).json({ message: "Flat not found" });
    }
    logger.info(`Updated flat: ${flatId}`);
    return res.status(200).json(updatedFlat);
  } catch (error) {
    logger.error(`Error updating flat ${req.params.id}:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

//DELETE FLAT
const deleteFlat = async (req, res) => {
  try {
    const { flatId } = req.params;

    // Validate flatId (Example: using mongoose isValidObjectId)
    if (!flatId) {
      logger.warn(`Invalid flat ID: ${flatId}`);
      return res.status(400).json({ message: "Invalid flat ID" });
    }

    // Fetch the flat details
    const flat = await Flat.findById(flatId);

    if (!flat) {
      logger.warn(`Flat not found with ID: ${flatId}`);
      return res.status(404).json({ message: "Flat not found" });
    }

    // Check if already deleted
    if (flat.deleted) {
      logger.warn(`Flat with ID: ${flatId} is already deleted`);
      return res.status(400).json({ message: "Flat already deleted" });
    }

    // Update the flat to soft-delete
    flat.deleted = new Date();
    flat.updated = new Date();
    await flat.save();

    logger.info(`Successfully deleted flat with ID: ${flatId}`);
    return res.status(200).json({
      message: "Flat successfully deleted",
      flat,
    });
  } catch (error) {
    logger.error(
      `Error deleting flat with ID: ${req.params.flatId}: ${error.message}`
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getAllFlats, getFlatById, addFlat, updateFlat, deleteFlat, addFlats };
