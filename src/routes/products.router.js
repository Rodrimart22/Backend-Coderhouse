import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";

import {
  getAll,
  newProduct,
  updateProduct,
  getOne,
  deleteProduct,
} from "../controllers/products.controller.js";

export default class ProductsRouter extends Router {
  constructor() {
    super();
  }

  init() {
    // get all product
    this.get(
      "/",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      getAll
    );
    // post a product
    this.post(
      "/",
      [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      newProduct
    );
    // get one product
    this.get(
      "/:pid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      getOne
    );
    // Update a product data
    this.put(
      "/:pid",
      [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      updateProduct
    );
    // Delete a product data
    this.delete(
      "/:pid",
      [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      deleteProduct
    );
  }
} // end
