import { Router } from "express";
import productManager from "../../manager/product.manager.js";
import __dirname from "../../utils.js";

const router = Router();

const manager = new productManager(`${__dirname}/files/products.json`);

router.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    // console.log(products);
    const io = req.app.get("socketio");
    io.emit("showProducts", products);
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
