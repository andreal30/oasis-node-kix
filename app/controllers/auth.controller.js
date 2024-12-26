import configs from "../configs/configs.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";
import crypto from "crypto";
import logger from "../utils/logger.js";
import { emailContent } from "../utils/emailContent.js";
// import { profile } from "console";
// import { OAuth2Client } from "google-auth-library";

// import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    // let profileImageUrl = "";
    // if (req.file) {
    //   profileImageUrl = await uploadUserImage(req.file);
    // }

    const userEmail = await User.findOne({ email: req.body.email });

    if (!userEmail) {
      // If no user exists with the given email, create a new user
      const userData = { ...req.body };
      const newUser = new User(userData);
      await newUser.save();
      return res.status(201).json(newUser);
    }

    if (userEmail.deleted !== null) {
      // Convert to Mongoose document if it's not already
      const user = await User.findById(userEmail._id);

      user.deleted = null;
      user.updated = new Date();
      user = { ...req.body, profileImage: profileImageUrl };

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
    logger.error("Error registering user:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// check that it accepts one field and then determines if its an email or a username
const login = async (req, res) => {
  try {
    const password = req.body.password;
    const emailOrUsername = req.body.email || req.body.username;

    if (!emailOrUsername || !password) {
      return res
        .status(400)
        .json({ message: "Email/username and password are required" });
    }

    console.log("1. LOGIN request received with:", {
      emailOrUsername,
      password,
    });

    const isEmail = emailOrUsername.includes("@");
    const query = isEmail
      ? { email: emailOrUsername }
      : { username: emailOrUsername };

    console.log("2. LOGIN query:", query);

    // Find the user by email or username
    const user = await User.findOne(query);

    console.log("3. LOGIN user:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password
    const passwordsMatch = await user.comparePasswords(password);
    if (!passwordsMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.deleted !== null) {
      return res.status(401).json({ message: "User is deleted" });
    }

    console.log("4. LOGIN passwordsMatch:");

    // Generate JWT token
    console.log("4.1 LOGIN SECRET:", configs.JWT_SECRET); // Log the secret before signing

    const token = jwt.sign(
      { user_id: user._id.toString(), isAdmin: user.isAdmin }, // Payload
      configs.JWT_SECRET, // Secret
      { expiresIn: "1h" } // Options
    );

    console.log("5. LOGIN token:", token);
    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    console.log("6. LOGIN cookie set");

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "LOGIN Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    logger.error("Error logging out:", error.message);
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
    //`http://flat-finder.andrealvarezcis.com/reset-password/${resetToken}`
    // Confirmar si el link es con el front o back (creo que es con el front, asi que se tiene que cambiar)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    try {
      const message = emailContent(resetUrl);
      await sendEmail({
        email: user.email,
        subject: "Reset Password - Flat Finder",
        message,
      });
      res.json({
        message:
          "Email sent. Please check your inbox for further instructions.",
      });
    } catch (error) {
      logger.error("Error sending email:", error.message);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save({ validateBeforeSave: false });
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    logger.error("Error forgot password:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

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
    logger.error("Error resetting password:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const client = new OAuth2Client(configs.GOOGLE_CLIENT_ID);
// console.log(client);

// Controller for handling Google authentication
// const handleGoogleAuth = async (req, res) => {
//   console.log("handleGoogleAuth", req.body);
//   const { token } = req.body;
//   try {
//     // Verify the Google ID token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: configs.GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();

//     // Check if user exists in the database, or create a new user
//     let user = await User.findOne({ email: payload.email });
//     console.log("user", user);
//     if (!user) {
//       userGoogle = new User({
//         email: payload.email,
//         name: payload.name,
//         googleId: payload.sub,
//       });
//       await userGoogle.save();
//     }

//     // Generate JWT token for the authenticated user
//     const accessToken = jwt.sign(
//       { userId: user.googleId, email: user.email },
//       configs.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Return the access token
//     res.json({ accessToken });
//   } catch (error) {
//     console.error("Google authentication error:", error);
//     res.status(400).send("Authentication failed");
//   }
// };

export {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
  // handleGoogleAuth,
};
