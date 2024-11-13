import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://andreal30:andreal30@krugerbackendap.h7nnc.mongodb.net/flatFinder?retryWrites=true&w=majority&appName=KrugerBackendAP"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
