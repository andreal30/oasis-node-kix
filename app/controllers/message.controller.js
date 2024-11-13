import { Message } from "../models/message.model.js";

const getAllFlats = async (req, res) => {
    try {
        const flats = await Flat.find();
        res.status(200).json(flats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export { getAllFlats };