import { cartsModel } from "./models/carts.model.js";

export default class Carts {
  constructor() {
    console.log("Working carts with DB");
  }

  getAll = async () => {
    const carts = await cartsModel.find();
    return carts;
  };

  getOne = async (id) => {
    const carts = await cartsModel.findOne({ _id: id }).lean();
    return carts;
  };

  save = async () => {
    const result = await cartsModel.create({});
    return result;
  };

  addOneProduct = async (id, pid) => {
    const cart = await cartsModel.findById(id);

    // Check if the product is already in the cart
    const existingProduct = cart.products.find((product) =>
      product.product.equals(pid)
    );

    if (existingProduct) {
      // If the product already exists, increment the quantity
      existingProduct.quantity += 1;
    } else {
      // If the product is not in the cart, add it with quantity 1
      cart.products.push({ product: pid, quantity: 1 });
    }

    const result = await cart.save();
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
