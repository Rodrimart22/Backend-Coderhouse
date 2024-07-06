import { Carts, Products } from "../dao/factory.js";
import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import { addProduct, purchase } from "../service/carts.service.js";

const CartsDao = new Carts();
const ProductsDao = new Products();
const cartsRepository = new CartsRepository(CartsDao);
const productsRepository = new ProductsRepository(ProductsDao);

const getAll = async (req, res) => {
  try {
    const cart = await cartsRepository.getAll();
    res.sendSuccess(cart);
  } catch (error) {
    res.sendServerError(error.message);
  }
};
const getOne = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsRepository.getOne(cid);
    res.sendSuccess(cart);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const save = async (req, res) => {
  try {
    const result = await cartsRepository.save();
    res.sendSucessNewResource(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

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
    const result = await cartsRepository.putProducts(cid, products);
    res.sendSucessNewResource(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

// Add one product to cart quantity
const addOneProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 0 } = req.body;
    const cart = await cartsRepository.getOne(cid);
    const product = await productsRepository.getOneProduct(pid);

    if (!cart || !product) {
      res.sendClientError("Cart or product not found");
    }

    const result = addProduct(cid, pid, quantity);
    res.sendSuccess("Producto modificado correctamente", result);
  } catch (error) {
    res.sendServerError("Error en controller", error.message);
  }
};

// Update one cart product quantity
const putQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartsRepository.getOne(cid);
    const product = await productsRepository.getOneProduct(pid);

    if (!quantity || !cart || !product) {
      res.sendClientError("Cart or product not found");
    }
    const result = cartsRepository.putQuantity(cid, pid, quantity);
    res.sendSuccess("", result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

// Delete an specific product of a cart
const deleteProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = cartsRepository.getOne(cid);
    const product = await productsRepository.getOneProduct(pid);
    if (!cart || !product) {
      res.sendClientError("Cart or Product not found");
    }
    const result = cartsRepository.deleteProduct(cid, pid);
    res.sendSuccess(result);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

//Delete all products of the cart
const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const result = cartsRepository.clearCart(cid);
    res.sendSuccess(result);
  } catch (error) {
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
