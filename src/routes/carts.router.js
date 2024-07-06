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
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      getOne
    );

    // Purchase the cart of the user
    this.post(
      "/:cid/purchase",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      cartPurchase
    );

    // Create a new cart
    // this.post("/", [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, save);

    // Update Cart with products
    this.put(
      "/:cid",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      putProducts
    );

    // Update one cart product quantity
    this.put(
      "/:cid/products/:pid",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      addOneProduct
    );

    // Delete an specific cart to blank
    this.put(
      "/:cid",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      deleteCart
    );

    // Delete an specific product of a cart
    this.delete(
      "/:cid/products/:pid",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      deleteProduct
    );
  }
}
