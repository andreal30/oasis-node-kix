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

    const deletedFlat = await Flat.findByIdAndUpdate(
      flatId,
      { updated: new Date(), deleted: new Date(), ...req.body }, // Set the 'deleted' field to the current date
      { new: true, runValidators: true } // Options for returning the updated document
    );
    if (!deletedFlat) {
      logger.warn(`Flat not found for update with ID: ${flatId}`);
      return res.status(404).json({ message: "Flat not found" });
    }
    logger.info(`Deleted flat: ${flatId}`);
    return res.status(200).json(deletedFlat);

    // const { flatId } = req.params;

    // // Find flat by ID
    // const flat = await Flat.findById(flatId);

    // if (!flat) {
    //   logger.warn(`Flat not found for deletion: ${flatId}`);
    //   return res.status(404).json({ message: "Flat not found" });
    // }

    // Check if the user is the owner of the flat or an admin
    // const isOwner = flat.ownerId.toString() === req.user.user_id;
    // const isAdmin = req.user.role === "admin";

    // if (!isOwner && !isAdmin) {
    //   logger.warn(
    //     `User ${req.user.user_id} attempted to delete flat ${flatId} without ownership`
    //   );
    //   return res.status(403).json({ message: "Access denied. Not the flat." });
    // }

    // Soft delete the flat by setting a deleted flag
    // flat.deleted = true;
    // await flat.save();

    // logger.info(`Soft deleted flat: ${flatId}`);
    // res.status(200).json({ message: "Flat deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting flat ${req.params.flatId}: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export { getAllFlats, getFlatById, addFlat, updateFlat, deleteFlat, addFlats };
