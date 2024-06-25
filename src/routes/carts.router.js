import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {
  getAll,
  getOne,
  save,
  putProducts,
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
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      getOne
    );

    // Create a new cart
    this.post("/", [accessRolesEnum.PUBLIC], passportStrategiesEnum.JWT, save);

    // Update Cart with products
    this.put(
      "/:cid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      putProducts
    );

    // Update one cart product quantity
    this.put(
      "/:cid/products/:pid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      putQuantity
    );

    // Delete an specific product of a cart
    this.put(
      "/:cid/products/:pid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      deleteProduct
    );

    // Delete an specific product of a cart
    this.put(
      "/:cid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      deleteCart
    );
  }
}
