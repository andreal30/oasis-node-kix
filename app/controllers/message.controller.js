import Message from "../models/message.model.js";
import logger from "../utils/logger.js";

const getAllMessages = async (req, res) => {
    try {
        const { flatId } = req.params;
        logger.info(`Fetching all messages for flat ID: ${flatId}`);
        const messages = await Message.find({ flatId });
        res.status(200).json(messages);
    } catch (error) {
        logger.error("Error fetching messages", error.message);
        res.status(500).json({ message: error.message });
    }
};

const getUserMessage = async (req, res) => {
    try {
        const { flatId, senderId } = req.params;
        logger.info(`Fetching messages for flat ID: ${flatId} and sender ID: ${senderId}`);
        const messages = await Message.find({ flatId, senderId });
        res.status(200).json(messages);
    } catch (error) {
        logger.error("Error fetching user messages", error.message);
        res.status(500).json({ message: error.message });
    }
};

const addMessage = async (req, res) => {
    try {
        const { flatId } = req.params;
        const newMessage = new Message({ ...req.body, flatId, senderId: req.user._id });
        const savedMessage = await newMessage.save();
        logger.info(`Created new message with id: ${savedMessage._id}`);
        res.status(201).json(savedMessage);
    } catch (error) {
        logger.error('Error creating message:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export { getAllMessages, getUserMessage, addMessage };
