import Message from "../models/message.model.js";
import { User } from "../models/user.model.js";
import logger from "../utils/logger.js";

const getAllMessages = async (req, res) => {
  try {
    const { flatId } = req.params;
    logger.info(`Fetching all messages for flat ID: ${flatId}`);
    const messages = await Message.find({ flatId });
    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }
    res.status(200).json(messages);
  } catch (error) {
    logger.error("Error fetching messages", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getUserMessage = async (req, res) => {
  try {
    const { flatId, senderId } = req.params;

    logger.info(
      `Fetching messages for flat ID: ${flatId} and sender ID: ${senderId}`
    );

    // Fetch messages from the database
    const messages = await Message.find({ flatId, senderId });

    // Check if messages exist
    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }

    // Respond with messages if found
    res.status(200).json(messages);
  } catch (error) {
    // Log and respond with error
    logger.error("Error fetching user messages", error.message);
    res.status(500).json({ message: error.message });
  }
};

const addMessage = async (req, res) => {
  try {
    const { flatId } = req.params;
    console.log(flatId);
    const loggedInUserId = req.user.user_id;
    const sender = await User.findById(loggedInUserId);
    const senderId = sender._id;
    const newMessage = new Message({ ...req.body, flatId, senderId });
    const savedMessage = await newMessage.save();
    logger.info(`Created new message with id: ${savedMessage._id}`);
    res.status(201).json(savedMessage);
  } catch (error) {
    logger.error("Error creating message:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export { getAllMessages, getUserMessage, addMessage };
