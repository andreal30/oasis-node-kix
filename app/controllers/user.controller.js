import { User } from "../models/user.model.js";

// Implementar la funcion getAllUsers
// Implementar la funcion getUserById
// Implementar la funcion updateUser
// Implementar la funcion deleteUser

// Buenas practicas a tomar en cuenta:
// - Siempre usar el try-catch para manejar errores
// - Cuando haya un error retornar codigo 500 (Internal Server Error)
// - Siempre retornar el codigo de estado correspondiente
// - 200 -> OK (Cuando todo esta bien)
// - 201 -> Created (Cuando se crea un nuevo recurso)
// - 400 -> Bad Request (Cuando el request del cliente no es correcto)
// - 401 -> Unauthorized
// - 404 -> Not Found (Cuando no se encuentra el recurso)
// - 500 -> Internal Server Error
// Si se animan a usar loggers, siempre registrar un evento de error, cada vez que ingresen al catch

// función ruta método http permisos
// getAllFlats /flats GET
// updateFlat /flats PATCH flat owner
// (dueño del
// departamento)
// deleteFlat /flats DELETE flat owner
// addFlat /flats POST flat owner

// función ruta método http permisos
// getFlatById /flats/:id GET

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, saveUser, getUserById, updateUser, deleteUser };
