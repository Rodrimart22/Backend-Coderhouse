import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {
  getAll,
  getOne,
  save,
  cartPurchase,
  putProducts,
  addOneProduct,
  putQuantity,
  deleteProduct,
  deleteCart,
} from "../controllers/carts.controller.js";

export default class CartsRouter extends Router {
  constructor() {
    super();
  }

  init() {
    // Get all  carts
    this.get("/", [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getAll);

    // Get One  cart
    this.get(
      "/:cid",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      getOne
    );

    // Update Cart with products
    this.put(
      "/:cid",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      putProducts
    );

    // Delete an specific cart to blank
    this.delete(
      "/:cid",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      deleteCart
    );

    // Purchase the cart of the user
    this.post(
      "/:cid/purchase",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      cartPurchase
    );

    // Update one cart product quantity
    this.put(
      "/:cid/products/:pid",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      addOneProduct
    );

    // Delete an specific product of a cart
    this.delete(
      "/:cid/products/:pid",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      deleteProduct
    );
  }
}
