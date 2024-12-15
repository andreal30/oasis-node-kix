import Flat from "../models/flat.model.js";

// Middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
  // Check if the user exists and has the isAdmin property set to true
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next(); // User is an admin, proceed to the next middleware or route handler
};

// Middleware to check if the user is the owner of the account
const ownerUserMiddleware = (req, res, next) => {
  if (req.user.isAdmin) return next();

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const loggedInUserId = req.user.user_id;
  const userIdToAccess =
    req.params.userId || req.body.userId || req.params.senderId;

  if (!mongoose.isValidObjectId(loggedInUserId)) {
    return res.status(400).json({ message: "Invalid logged-in user ID" });
  }

  if (loggedInUserId !== userIdToAccess) {
    return res
      .status(403)
      .json({ message: "Access denied. Not the account owner." });
  }

  next();
};

const flatOwnerMiddleware = async (req, res, next) => {
  // Ensure req.user is set (after authentication)
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Get the user ID from req.user and the ID being accessed (from params or body)
  const loggedInUserId = req.user.user_id;
  const flat = await Flat.findById(req.params.flatId);

  if (!flat) {
    return res.status(404).json({ message: "Flat not found" });
  }

  const ownerId = flat.ownerId.toString();

  // Check if the logged-in user is the owner of the account
  if (loggedInUserId !== ownerId) {
    return res
      .status(403)
      .json({ message: "Access denied. Not the Flat owner." });
  }

  next(); // User is the owner, proceed to the next middleware or route handler
};

export { adminMiddleware, ownerUserMiddleware, flatOwnerMiddleware };
