import Message from "../models/message.model.js";
import logger from "../utils/logger.js";

const getAllMessages = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info(`Fetching all messages for flat ID: ${id}`);
        const messages = await Message.find({ flatId: id });
        res.status(200).json(messages);
    } catch (error) {
        logger.error("Error fetching messages", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getUserMessage = async (req, res) => {
    try {
        const { id, senderId } = req.params;
        logger.info(`Fetching messages for flat ID: ${id} and sender ID: ${senderId}`);
        const messages = await Message.find({ flatId: id, senderId: senderId });
        res.status(200).json(messages);
    } catch (error) {
        logger.error("Error fetching user messages", error.message);
        res.status(500).json({ message: error.message });
    }
};

const addMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const newMessage = new Message({ ...req.body, flatId: id });
        const savedMessage = await newMessage.save();
        logger.info(`Created new message with id: ${savedMessage._id}`);
        res.status(201).json(savedMessage);
    } catch (error) {
        logger.error('Error creating message:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export { getAllMessages, getUserMessage, addMessage }
