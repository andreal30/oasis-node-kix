import jwt from "jsonwebtoken";
import configs from "../configs/configs.js";
import logger from "../utils/logger.js";

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("1. AUTH  MIDDLEWARE authHeader:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    console.log("2. AUTH  MIDDLEWARE token:", token);
    console.log("2.1 AUTH  MIDDLEWARE configs.JWT_SECRET:", configs.JWT_SECRET);

    if (!token) {
      logger.error("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token and extract the payload
    const verified = jwt.verify(token, configs.JWT_SECRET);
    console.log("3. AUTH MIDDLEWARE verified:", verified);

    // Check for expiration
    if (verified.exp * 1000 < Date.now()) {
      logger.warn("Token has expired");
      return res.status(401).json({ message: "Token has expired" });
    }

    req.user = verified; // Attach the decoded payload
    next();
  } catch (error) {
    logger.error("JWT verification failed:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticationMiddleware;
