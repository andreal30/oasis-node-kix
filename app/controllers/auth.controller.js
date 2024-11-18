import configs from "../configs/configs.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";
import crypto from "crypto";
import logger from "../utils/logger.js";
// import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const userEmail = await User.findOne({ email: req.body.email });

    if (!userEmail) {
      // If no user exists with the given email, create a new user
      const newUser = new User(req.body);
      await newUser.save();
      return res.status(201).json(newUser);
    }

    if (userEmail.deleted !== null) {
      // Convert to Mongoose document if it's not already
      const user = await User.findById(userEmail._id);

      user.deleted = null;
      user.updated = new Date();

      // Check if a new password is provided in the request
      if (req.body.password) {
        user.password = req.body.password;
        await user.validate(); // Manually trigger validation (and any hooks)
      }

      // Save the user document (this triggers the pre-save hook)
      await user.save();

      return res.status(200).json({
        message: "User restored successfully",
        user,
      });
    }

    // If the user exists and is not deleted, return a conflict error
    res.status(409).json({ message: "User already exists and is active" });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const password = req.body.password;
    const emailUsername = req.body.username || req.body.email;

    // Determine if the input is an email or a username
    const isEmail = emailUsername.includes("@");
    const query = isEmail
      ? { email: emailUsername }
      : { username: emailUsername };

    // Find the user by email or username
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const passwordsMatch = await user.comparePasswords(password);
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      configs.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token as httpOnly cookie (optional)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    //1. Vamos a validar si el correo que esta enviando existe o esta alamacenado en la BDD
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //2.- Vamos a generar un token unico que vamos a enviar al correo del usuario
    const resetToken = user.generatePasswordToken();
    await user.save({ validateBeforeSave: false });

    //3.- Vamos a generar la url que vamos a enviar al correo del usuario
    //http://localhost:5173/reset-password/jkashdfjkasdfhk&hjaf
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    try {
      const message = `Para resetear el password, accede al siguiente link: ${resetUrl}`;
      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message,
      });
      res.json({ message: "Email sent" });
    } catch (error) {
      logger.error(error.message);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save({ validateBeforeSave: false });
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("Token received:", token);
    console.log("Password received:", password);

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("Hashed token:", resetPasswordToken);

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    logger.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { register, login, forgotPassword, resetPassword };
