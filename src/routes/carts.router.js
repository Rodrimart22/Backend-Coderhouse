import { Router } from "express";
import Carts from "../dao/dbManagers/carts.manager.js";

const router = Router();
const cartsManager = new Carts();

router.get("/", async (req, res) => {
  try {
    const carts = cartsManager.getAll();
    res.send({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).send({ status: "errror", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    if (!products) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete data" });
    }

    const result = await cartsManager.save({
      products,
    });

    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    const { cid } = req.params;
    if (!products) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete data" });
    }

    const result = await cartsManager.update(cid, {
      products,
    });

    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;
