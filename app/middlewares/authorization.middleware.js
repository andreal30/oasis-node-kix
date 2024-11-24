// Middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
  // Check if the user exists and has the isAdmin property set to true
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next(); // User is an admin, proceed to the next middleware or route handler
};

// Middlware if user is owner
// Middleware to check if the user is the owner of the account
const ownerUserMiddleware = (req, res, next) => {
  // Ensure req.user is set (after authentication)
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Get the user ID from req.user and the ID being accessed (from params or body)
  const loggedInUserId = req.user.user_id;
  const userIdToAccess = req.params.userId || req.body.userId;

  // Check if the logged-in user is the owner of the account
  if (loggedInUserId !== userIdToAccess) {
    return res
      .status(403)
      .json({ message: "Access denied. Not the account owner." });
  }

  next(); // User is the owner, proceed to the next middleware or route handler
};

export { adminMiddleware, ownerUserMiddleware };
