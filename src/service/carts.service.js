import Carts from "../dao/dbManagers/carts.manager.js";

const cartsManager = new Carts();

const getAll = async () => {
  const cart = await cartsManager.getAll();
  return cart;
  
};
const getOne = async (cid) => {
  const cart = await cartsManager.getOne(cid);
  return cart;
};

const save = async () => {
  const result = await cartsManager.save();
  return result;
};

// Update the cart with products
const putProducts = async (cid, products) => {
  const result = await cartsManager.updateProducts(cid, products);
  return result;
};

// Update one cart product quantity
const putQuantity = async (cid, pid, quantity) => {
  const result = await cartsManager.updateOneProduct(cid, pid, quantity);
  return result;
};

//Clear cart of products
const clearCart = async (cid) => {
  const result = await cartsManager.clearCart(cid);
  return result;
};

// Delete an specific product of a cart
const deleteProduct = async (cid, pid) => {
  const result = await cartsManager.deleteCartProduct(cid, pid);
  return result;
};

//Delete all products of the cart
const deleteCart = async (cid) => {
  const result = await cartsManager.clearCart(cid);
  return result;
};

export {
  getAll,
  getOne,
  save,
  putProducts,
  putQuantity,
  clearCart,
  deleteCart,
  deleteProduct,
};
