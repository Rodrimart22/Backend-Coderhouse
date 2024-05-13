import { Router } from "express";
import Products from "../dao/dbManagers/products.manager.js";

const router = Router();
const productsManager = new Products();

// Get all products
router.get("/", async (req, res) => {
  try {
    console.log("obteniendo productos");
    const products = await productsManager.getAll();
    res.send({ status: "success", payload: products });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Create a new product
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

// Update a product data
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
