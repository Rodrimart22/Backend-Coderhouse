import { Router } from "express";
import Carts from "../dao/dbManagers/carts.manager.js";
import Products from "../dao/dbManagers/products.manager.js";

const router = Router();
const cartsManager = new Carts();
const productsManager = new Products();

// Get all  carts
router.get("/", async (req, res) => {
  try {
    console.log("Obteniendo Carritos");
    const carts = await cartsManager.getAll();
    res.send({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Get all  carts
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    console.log("Obteniendo Carrito");
    const cart = await cartsManager.getOne(cid)
    res.send({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Create a new cart
router.post("/", async (req, res) => {
  try {
    const data = { products: [] };
    const result = await cartsManager.save(data);

    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});
// router.post("/", async (req, res) => {
//   try {
//     const { pid, quantity = 1 } = req.body;
//     const product = await productsManager.getOne(pid);
//     if (!product) {
//       return res
//         .status(400)
//         .send({ status: "error", message: "incomplete data" });
//     }
//     const { _id } = product;
//     const data = { products: [{ product: _id, quantity }] };
//     const result = await cartsManager.save(data);

//     res.status(201).send({ status: "success", payload: result });
//   } catch (error) {
//     res.status(500).send({ status: "error", message: error.message });
//   }
// });

// Update the cart with products
router.put("/:cid", async (req, res) => {
  try {
    const products = req.body;
    const { cid } = req.params;
    console.log(products);
    if (!products) {
      return res
        .status(400)
        .send({ status: "error", message: "incomplete data" });
    }
    const result = await cartsManager.updateProducts(cid, products);

    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Update one cart product quantity
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartsManager.getOne(cid);
    const product = await productsManager.getOne(pid);
    if (!quantity || !cart || !product) {
      res
        .status(400)
        .send({ status: "error", message: "Cart or Product not found" });
    }

    const result = await cartsManager.updateOneProduct(cid, pid, quantity);
    res.send({ status: "sucess", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Delete an specific product of a cart
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartsManager.getOne(cid);
    const product = await productsManager.getOne(pid);
    if (!cart || !product) {
      res
        .status(400)
        .send({ status: "error", message: "Cart or Product not found" });
    }
    const result = await cartsManager.deleteCartProduct(cid, pid);
    res.send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

//Delete all products of the cart
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartsManager.clearCart(cid);
    res.send({ status: "sucess", payload: result });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

export default router;
