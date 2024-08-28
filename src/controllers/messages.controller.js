import { messagesRepository } from "../repositories/factoryRepository.js";

// Get all messages 
const getAll = async (req, res) => {
  try {
    const result = await messagesRepository.getAll();
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError("Message Error", error.message);
  }
};

// Save a new message
const saveMessage = async (req, res) => {
  try {
    const name = req.user.name;
    const { message } = req.body;
    if (!message || message === "" || !name) {
      return res.sendClientError("No message received");
    }
    const data = { user: name, message };
    const result = await messagesRepository.saveMessage(data);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError("Error Controller Message" + error.message);
  }
};

export { getAll, saveMessage };
