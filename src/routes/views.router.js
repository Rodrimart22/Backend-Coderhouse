import { Router } from "express";
import Products from "../dao/dbManagers/products.manager.js";
import Carts from "../dao/dbManagers/carts.manager.js"
import Messages from "../dao/dbManagers/messages.manager.js"

const router = Router();

const productsManager = new Products();
const cartsManager = new Carts();
const messagesManager = new Messages();

router.get("/products-view", async (req, res) => {
  try {
    const products = await productsManager.getAll();
    res.render("products", { products });
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/carts-view", async (req, res) => {
  try {
    const carts = await cartsManager.getAll();
    res.render("carts", { carts });
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await messagesManager.getAll();
    res.render("messages", { messages });
  } catch (error) {
    console.error(error.message);
  }
});

export default router;