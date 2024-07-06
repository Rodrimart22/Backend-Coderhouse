import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";

import {
  getAll,
  newProduct,
  updateProduct,
  getOne,
  deleteProduct
} from "../controllers/products.controller.js";

export default class ProductsRouter extends Router {
  constructor() {
    super();
  }

  init() {
    // get all product
    this.get(
      "/",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      getAll
    );
    // get one product
    this.get(
      "/:pid",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      getOne
    );
    // post a product
    this.post(
      "/",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      newProduct
    );
    // Update a product data
    this.put(
      "/:pid",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      updateProduct
    );
    // Delete a product data
    this.delete(
      "/:pid",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      deleteProduct
    );
  }
} // end


