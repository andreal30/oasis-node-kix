import mongoose from "mongoose";
import configs from "../configs/configs.js";
import logger from "../utils/logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(configs.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);
  }
};

export default connectDB;
