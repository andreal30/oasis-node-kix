import Flat from "../models/flat.model.js";
import { User } from "../models/user.model.js";
import logger from "../utils/logger.js";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./../configs/firebase.js";
import { calculateAge } from "../utils/date.js";

const validateUnique = async (req, res) => {
  const { field, value } = req.body;

  if (!field || !value) {
    return res
      .status(400)
      .json({ isUnique: false, message: "Field and value are required." });
  }

  // Check uniqueness
  const exists = await User.findOne({ [field]: value });
  if (exists) {
    return res.status(200).json({
      isUnique: false,
      message: `The ${field} "${value}" is already taken.`,
    });
  }

  res.status(200).json({ isUnique: true });
};

const getFlatsCountForUsers = async (req, res) => {
  try {
    const { userIds } = req.body; // Expecting an array of user IDs to be passed in the request body

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an array of user IDs." });
    }

    // Fetch the flat count for each user
    const flatsCountResults = await Promise.all(
      userIds.map(async (userId) => {
        const flatsCount = await Flat.countDocuments({ ownerId: userId });
        return { userId, flatsCount }; // Return both userId and flat count
      })
    );

    logger.info(`Fetched flat counts for ${userIds.length} users`);

    return res.status(200).json(flatsCountResults);
  } catch (error) {
    logger.error(`Error fetching flat counts: ${error.message}`);
    return res
      .status(500)
      .json({ error: "Failed to fetch flat counts. Please try again later." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Step 1: Fetch all users excluding deleted ones
    const usersDb = await User.find({ deleted: null });

    // Step 2: Add dynamic fields (flatCount) to users
    const users = await Promise.all(
      usersDb.map(async (user) => ({
        ...user.toObject(),
        flatCount: await Flat.countDocuments({ ownerId: user._id }),
        age: calculateAge(new Date(user.birthDate)),
      }))
    );

    // Step 5: Return the result
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Error fetching users." });
  }
};

const getUserById = async (req, res) => {
  try {
    console.log("1. USER ID Received request for user ID:", req.params.userId);
    console.log("2. USER ID Authenticated user:", req.user);

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    logger.error("Error fetching user by ID", error.message);
    res.status(400).send(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      updated: new Date(),
    };
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    logger.error("Error updating user", error.message);
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const loggedInUserId = req.user.user_id; // Assuming middleware sets this
    const { userId } = req.params; // ID of the user to delete

    // Fetch the logged-in user's details
    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser) {
      return res.status(404).json({ message: "Logged-in user not found" });
    }

    // Check if the logged-in user is either an admin or the account owner
    if (!loggedInUser.isAdmin && loggedInUserId !== userId) {
      return res.status(403).json({
        message:
          "Access denied. Only admins or the account owner can perform this action.",
      });
    }

    // Perform a logical delete by updating the 'deleted' field
    const user = await User.findByIdAndUpdate(
      userId,
      { deleted: new Date(), updated: new Date() }, // Mark as deleted and update timestamp
      { new: true, runValidators: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User marked as deleted", user });
  } catch (error) {
    logger.error("Error deleting user", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addFlatFavourites = async (req, res) => {
  try {
    const loggedInUserId = req.user.user_id;
    const user = await User.findById(loggedInUserId);
    const { flatId } = req.params;
    const flat = await Flat.findById(req.params.flatId);

    //Validamos si la orden existe en la BDD
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!flat) {
      return res.status(404).json({ message: "Flat not found" });
    }
    //Vamos a asociar el comentario que anteriormente insertamos en la BDD a la orden que acabamos
    //de encontrar
    if (user.favouriteFlats.includes(flatId)) {
      return res
        .status(400)
        .json({ message: "Flat already added to favourites" });
    }

    user.favouriteFlats.push(flatId);
    user.updated = new Date();

    await user.save();
    res.status(201).json({ message: "Flat added to favourites", user });
  } catch (error) {
    logger.error("Error adding flat to favourites:", error.message);
    res.status(400).send(error);
  }
};

const removeFlatFavourites = async (req, res) => {
  try {
    const loggedInUserId = req.user.user_id;
    const user = await User.findById(loggedInUserId);
    const { flatId } = req.params;
    const flat = await Flat.findById(flatId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if flat exists
    if (!flat) {
      return res.status(404).json({ message: "Flat not found" });
    }

    // Check if the flat is in user's favourites
    if (!user.favouriteFlats.includes(flatId)) {
      return res.status(404).json({ message: "Flat not found in favourites" });
    }

    // Remove the flat from favourites
    user.favouriteFlats = user.favouriteFlats.filter(
      (id) => id.toString() !== flatId
    );
    user.updated = new Date();

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Flat removed from favourites", user });
  } catch (error) {
    logger.error("Error removing flat from favourites:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const allowAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "User is already an admin" });
    }

    user.isAdmin = true;
    user.updated = new Date();

    await user.save();

    res.status(200).json({ message: "User marked as admin", user });
  } catch (error) {
    logger.error("Error marking user as admin:", error.message);
    res.status(500).send(error);
  }
};

const denyAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(400).json({ message: "User is not an admin" });
    }
    user.isAdmin = false;
    user.updated = new Date();

    await user.save();

    res.status(200).json({ message: "User removed from admin", user });
  } catch (error) {
    logger.error("Error removing user from admin:", error.message);
    res.status(500).send(error);
  }
};

export {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addFlatFavourites,
  removeFlatFavourites,
  allowAdmin,
  denyAdmin,
  validateUnique,
  getFlatsCountForUsers,
};
