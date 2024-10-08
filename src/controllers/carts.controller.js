import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import { addProduct, purchase } from "../service/carts.service.js";


// Get All carts
const getAll = async (req, res) => {
  try {
    const cart = await CartsRepository.getAll();
    res.sendSuccess(cart);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

// Get one cart by id
const getOne = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartsRepository.getOne(cid);
    res.sendSuccess(cart);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

// Create a new empty cart
const save = async (req, res) => {
  try {
    const result = await CartsRepository.save();
    res.sendSucessNewResource(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

// Run shopping process of the cart
const cartPurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const user = req.user;
    const result = await purchase(cid, user);
    res.sendSucessNewResource(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

// Update the cart with products
const putProducts = async (req, res) => {
  try {
    const products = req.body;
    const { cid } = req.params;
    if (!products) {
      res.sendClientError("No products received");
    }
    const result = await CartsRepository.putProducts(cid, products);
    res.sendSucessNewResource(result);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

// Add one product to cart quantity
const addOneProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 0 } = req.body;
    const cart = await CartsRepository.getOne(cid);
    const product = await ProductsRepository.getOneProduct(pid);

    if (!cart || !product) {
      res.logger.info("Cart or product not found");
      res.sendClientError("Cart or product not found");
    }

    if (product.owner == req.user.email) {
      req.logger.warning("Product owners can add it to their cart");
      res.sendClientError("You can't add your own products");
    }

    const result = await addProduct(cid, pid, quantity);
    res.sendSuccess(result);
    // res.sendSuccess(`Producto modificado correctamente ${result}`);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError("Error en controller", error.message);
  }
};

// Update one cart product quantity
const putQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await CartsRepository.getOne(cid);
    const product = await ProductsRepository.getOneProduct(pid);

    if (!quantity || !cart || !product) {
      res.sendClientError("Cart or product not found");
    }
    const result = CartsRepository.putQuantity(cid, pid, quantity);
    res.sendSuccess("", result);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

// Delete an specific product of a cart
const deleteProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = CartsRepository.getOne(cid);
    const product = await ProductsRepository.getOneProduct(pid);
    if (!cart || !product) {
      res.sendClientError("Cart or Product not found");
    }
    const result = CartsRepository.deleteProduct(cid, pid);
    res.sendSuccess(result);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

//Delete all products of the cart
const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const result = CartsRepository.clearCart(cid);
    res.sendSuccess(result);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

export {
  getAll,
  getOne,
  save,
  cartPurchase,
  putProducts,
  addOneProduct,
  putQuantity,
  deleteProduct,
  deleteCart,
};
