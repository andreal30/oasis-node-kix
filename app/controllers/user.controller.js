import { User } from "../models/user.model.js";
import logger from "../utils/logger.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    // const product = await Product.find({ _id: req.params.id });
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    logger.error(error.message);
    res.status(400).send(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { updated: new Date() }, // Set the 'deleted' field to the current date
      { new: true, runValidators: true } // Options for returning the updated document
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    logger.error(error.message);
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { deleted: new Date(), updated: new Date() }, // Set the 'deleted' field to the current date
      { new: true, runValidators: true } // Options for returning the updated document
    );

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    logger.error(error.message);
    res.status(400).send(error);
  }
};

export { getAllUsers, getUserById, updateUser, deleteUser };
