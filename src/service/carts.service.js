import {
  cartsRepository,
  productsRepository,
} from "../repositories/factoryRepository.js";
import * as ticketsService from "./tickets.service.js";
import mongoose from "mongoose";

// Add one product quantity or update quantity
const addProduct = async (cid, pid, quantity = 0) => {
  try {
    const result =
      quantity === 0
        ? await cartsRepository.addOneProduct(cid, pid)
        : await cartsRepository.putQuantity(cid, pid, quantity);

    return result;
  } catch (error) {
    console.error("Error en service - ", error.message);
  }
};

// Process to purchase the cart of the user,
const purchase = async (cid, user) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const cart = await cartsRepository.getOne(cid);

    if (!cart || !cart.products || cart.products.length === 0) {
      console.error("Error en Carts service - Carrito no encontrado o vacío");
      return;
    }

    const operations = await Promise.all(
      cart.products.map(async ({ product, quantity }) => {
        try {
          const productData = await productsRepository.getOneProduct(product);
          // console.log("Product data:", productData);

          if (productData.stock >= quantity) {
            productData.stock -= quantity;
            await productsRepository.updateProduct(product, {
              stock: productData.stock,
            });
            return quantity * productData.price;
          } else {
            return { product, quantity };
          }
        } catch (error) {
          console.error("Error processing product:", error.message);
          throw error; // Propagar el error para identificar la causa raíz.
        }
      })
    );

    const amount = operations
      .filter((result) => typeof result === "number")
      .reduce((acc, value) => acc + value, 0);
    const outStock = operations.filter((result) => typeof result !== "number");

    const ticket = await ticketsService.generatePurchase(user, amount);

    await cartsRepository.putProducts(cid, outStock);
    await session.commitTransaction();

    return ticket;
  } catch (error) {
    await session?.abortTransaction();
    console.error("Error en Carts service - ", error.message);
  } finally {
    session?.endSession();
  }
};

export { addProduct, purchase };
