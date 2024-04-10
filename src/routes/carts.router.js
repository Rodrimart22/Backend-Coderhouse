import { Router } from "express";
import cartManager from "../manager/cart.manager.js";
import __dirname from "../utils.js";
import productManager from "../manager/product.manager.js";

const router = Router();
const productM = new productManager(`${__dirname}/files/products.json`);

const manager = new cartManager(`${__dirname}/files/carts.json`);

router.post("/", async (req, res) => {
  const cart = await manager.addCart();
  res.send({ status: "success", payload: cart });
});

router.get("/:cid", async (req, res) => {
  const id = +req.params.cid;
  const cart = await manager.getCartById(id);

  if (cart != null) {
    res.send({ status: "success", payload: cart.products });
  } else {
    res.send({ status: "error", message: "Error: No se encontro el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cid = +req.params.cid;
  const pid = +req.params.pid;

  const carts = await manager.getCarts();
  const id = carts.findIndex((cart) => cart.id === cid);
  const cartById = carts[id];

  const indexProductInCart = cartById.products.findIndex(
    (product) => product.id === pid
  );

  if (indexProductInCart != -1) {
    cartById.products[indexProductInCart].quantity += 1;
  } else {
    const product = await productM.getProductById(pid);
    product && cartById.products.push({ id: product.id, quantity: 1 });
  }

  carts[id] = cartById;

  await manager.saveCart(carts);
  res.send({ status: "success", payload: cartById });
});

export default router;
