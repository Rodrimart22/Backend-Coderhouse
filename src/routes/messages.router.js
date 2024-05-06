import { Router } from "express";
import Messages from "../dao/dbManagers/messages.manager.js";

const router = Router();
const messagesManager = new Messages();

router.get("/", async (req, res) => {
  try {
    const messages = messagesManager.getAll();
    res.send({ status: "success", payload: messages });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user, message } = req.body;
    if (!user || !message) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete data" });
    }

    const result = await messagesManager.save({
      user,
      message,
    });

    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;
