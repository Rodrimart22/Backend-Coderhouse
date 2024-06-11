import Router from "./router.js";
import Carts from "../dao/dbManagers/carts.manager.js";
import Products from "../dao/dbManagers/products.manager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";

export default class CartsRouter extends Router {
  constructor() {
    super();
    this.cartsManager = new Carts();
    this.productsManager = new Products();
  }

  init() {
    // Get all  carts
    this.get(
      "/",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      this.getAll
    );

    // Get One  cart
    this.get(
      "/:cid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      this.getOne
    );

    // Create a new cart
    this.post(
      "/",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      this.save
    );

    // Update Cart with products
    this.put(
      "/:cid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      this.putProducts
    );

    // Update one cart product quantity
    this.put(
      "/:cid/products/:pid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      this.putQuantity
    );

    // Delete an specific product of a cart
    this.put(
      "/:cid/products/:pid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      this.deleteProduct
    );

    // Delete an specific product of a cart
    this.put(
      "/:cid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      this.deleteCart
    );
  }

  async getAll(req, res) {
    try {
      const cart = await this.cartsManager.getAll();
      res.sendSuccess(cart);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }
  async getOne(req, res) {
    try {
      const { cid } = req.params;
      const cart = await this.cartsManager.getOne(cid);
      res.sendSuccess(cart);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }

  async save(req, res) {
    try {
      const result = await this.cartsManager.save();
      res.sendSucessNewResource(result);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }

  // Update the cart with products
  async putProducts(req, res) {
    const products = req.body;
    const { cid } = req.params;
    if (!products) {
      res.sendClientError("No products received");
    }
    const result = await this.cartsManager.updateProducts(cid, products);
    res.sendSucessNewResource(result);
  }
  catch(error) {
    res.sendServerError(error.message);
  }

  // Update one cart product quantity
  async putQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const cart = await this.cartsManager.getOne(cid);
      const product = await this.productsManager.getOne(pid);

      if (!quantity || !cart || !product) {
        res.sendClientError("Cart or product not found");
      }
      const result = await this.cartsManager.updateOneProduct(
        cid,
        pid,
        quantity
      );
      res.sendSuccess(result);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }

  // Delete an specific product of a cart
  async deleteProduct(req, res) {
    try {
      const { cid, pid } = req.params;
      const cart = await this.cartsManager.getOne(cid);
      const product = await this.productsManager.getOne(pid);
      if (!cart || !product) {
        res.sendClientError("Cart or Product not found");
      }
      const result = await this.cartsManager.deleteCartProduct(cid, pid);
      res.sendSuccess(result);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }

  //Delete all products of the cart
  async deleteCart(req, res) {
    try {
      const { cid } = req.params;
      const result = await this.cartsManager.clearCart(cid);
      res.sendSuccess(result);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }
}
