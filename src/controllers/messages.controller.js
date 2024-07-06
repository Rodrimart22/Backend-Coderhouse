import { Messages } from "../dao/factory.js";
import MessagesRepository from "../repositories/messages.repository.js";

const MessagesDao = new Messages();
const messagesRepository = new MessagesRepository(MessagesDao);

const getAll = async (req, res) => {
  try {
    const result = await messagesRepository.getAll();
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError("Message Error", error.message);
  }
};

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
