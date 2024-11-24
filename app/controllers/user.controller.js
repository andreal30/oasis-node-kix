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
    const user = await User.findById(req.params.userId);

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
      req.params.userId,
      { updated: new Date(), ...req.body }, // Set the 'deleted' field to the current date
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
      req.params.userId,
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

const addFlatFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const { flatId } = req.body;
    const flat = await Flat.findById(req.params.flatId);

    //Vamos a relacionar el comentario con la orden
    //Primero necesito buscar la orden con el id que recibi en el path param
    // const order = await User.findById(userId).populate("favourites");
    // const user = await User.findById(userId)

    //Validamos si la orden existe en la BDD
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!flat) {
      return res.status(404).json({ message: "Flat not found" });
    }
    //comments: ["id comentario 1", "id comentario 2"]
    //Vamos a asociar el comentario que anteriormente insertamos en la BDD a la orden que acabamos
    //de encontrar
    user.favouriteFlats.push(flatId);

    //Vamos a guardar la orden con el nuevo comentario en nuestra BDD
    await user.save();

    res.status(201).json({ message: "Flat added to favourites" });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send(error);
  }
};

export { getAllUsers, getUserById, updateUser, deleteUser, addFlatFavourites };
