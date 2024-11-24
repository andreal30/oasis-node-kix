import mongoose from "mongoose";

const flatSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    streetName: {
        type: String,
        required: true
    },
    streetNumber: {
        type: Number,
        required: true
    },
    areaSize: {
        type: Number,
        required: true
    },
    hasAc: {
        type: Boolean,
        default: false,
        required: true
    },
    yearBuilt: {
        type: Number,
        required: true
    },
    rentPrice: {
        type: Number,
        required: true
    },
    dateAvailable: {
        type: Date,
        required: true
    },
    rooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

const Flat = mongoose.model("Flat", flatSchema);
export default Flat;