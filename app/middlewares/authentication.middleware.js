import jwt from "jsonwebtoken";
import configs from "../configs/configs.js";
import logger from "../utils/logger.js";

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, configs.JWT_SECRET);
    logger.info("Decoded token:", decoded); // Log the decoded token
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("JWT verification failed:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticationMiddleware;
