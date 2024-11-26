import { string } from "joi";
import mongoose from "mongoose";

// 1er paso: definir el schema de la BDD para la coleccion de usuarios
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    isAdmin: {

        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    favouriteFlats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flat"
            // tiene que ser exactamente igual a lo que se defina dentro del modelo de flat
        }
    ],
    // El proyecto les dice qu hagan un borrado fisico, pero es mejor hacer un borrado logico
    deleted: {
        type: Date,
        default: null
    },
})

export const User = mongoose.model("User", userSchema)