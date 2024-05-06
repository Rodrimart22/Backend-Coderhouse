import { Router } from "express";
import Products from "../dao/dbManagers/products.manager.js";

const router = Router();
const productsManager = new Products();

router.get("/", async (req, res) => {
  try {
    const products = productsManager.getAll();
    res.send({ status: "success", payload: products });
  } catch (error) {
    res.status(500).send({ status: "errror", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category
    ) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete data" });
    }

    const result = await productsManager.save({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;
    const { pid } = req.params;
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category
    ) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete data" });
    }

    const result = await productsManager.update(pid, {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });

    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "errror", message: error.message });
  }
});

export default router;
