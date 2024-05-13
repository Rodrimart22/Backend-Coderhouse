import { cartsModel } from "../dbManagers/models/carts.model.js";

export default class Carts {
  constructor() {
    console.log("Working carts with DB");
  }

  getAll = async () => {
    const carts = await cartsModel.find();
    return carts;
  };

  getOne = async (id) => {
    const carts = await cartsModel.find({ _id: id });
    return carts;
  };

  save = async (productId) => {
    const result = await cartsModel.create(productId);
    return result;
  };

  updateProducts = async (id, products) => {
    const result = await cartsModel.updateOne(
      { _id: id },
      {
        products: products,
      }
    );

    return result;
  };

  clearCart = async (id) => {
    const result = await cartsModel.updateOne(
      { _id: id },
      { $set: { products: [] } }
    );
    return result;
  };

  updateOneProduct = async (id, pid, quantity) => {
    const result = await cartsModel.updateOne(
      { _id: id, "products.product": pid }, // Encuentra el carrito y el producto

      {
        $set: { "products.$.quantity": quantity }, // Actualiza la cantidad
      }
    );

    return result;
  };

  deleteCartProduct = async (id, pid) => {
    const cart = await cartsModel.updateOne(
      { _id: id },
      { $pull: { products: { product: { _id: pid } } } }
    );

    return cart;
  };

  deleteCart = async (cid) => {
    const result = await cartsModel.updateOne({ _id: cid }, { products: [] });
    return result;
  };
}
