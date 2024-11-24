import mongoose from "mongoose";
import logger from "../utils/logger.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true, // turns everything into lowercase
    trim: true, // trims (deletes) the blank space at the beginning and end
    minlength: [2, "Email must have at least 2 characters"],
    maxlength: 100,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must have at least 8 characters"],
    maxlength: 100,
    match: [
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
      "Password must contain at least one letter, one number and one spcecial character",
    ],
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    minlength: [4, "Username must have at least 4 characters"],
    maxlength: 50,
    unique: [true, "This username is already taken, please choose another one"],
  },
  firstName: {
    type: String,
    required: [true, "First Name is required"],
    minlength: [2, "Name must have at least 2 characters"],
    maxlength: 100,
    trim: true,
    alias: "name", // creates a reference name, with which we can use to refer it in the code -> User.name en lugar de User.firstName
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    minlength: [2, "Last name must have at least 2 characters"],
    maxlength: 100,
    trim: true,
    alias: "last",
  },
  birthDate: {
    type: Date,
    required: [true, "Date of birth is required"],
    alias: "birth",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  favouriteFlats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat", // has to be exactly the same as the one define within the flat.model
      alias: "favs",
    },
  ],
  resetPasswordToken: String, // to be able to generate an unique identifier (token) that we're going to send to the user (email)
  resetPasswordExpires: Date, // to be able to define the expiration date of our token
  // El proyecto les dice qu hagan un borrado fisico, pero es mejor hacer un borrado logico
  deleted: {
    type: Date,
    default: null,
  },
});

// Pre-hook for hashing a password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// A hook for deleting the password from the object we're returning to the client
userSchema.post("find", function (docs, next) {
  docs.forEach((doc) => {
    doc.password = undefined;
  });
  next();
});

// A method for comparing the password stored in the DB with the one being sent by the client for authentication
userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method for creating a token for resetting the password
userSchema.methods.generatePasswordToken = function () {
  // Generate a random string in hex format
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Save the hashed token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration time of the token: 1 hour
  this.resetPasswordExpires = Date.now() + 3600000;

  return resetToken;
};

export const User = mongoose.model("User", userSchema, "User");
