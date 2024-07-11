import Router from "./router.js";
import { generateProductsMock } from "../mocks/fakeProducts.js";

import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";

export default class MockingProductsRouter extends Router {
  constructor() {
    super();
  }

  init() {
    //Obtain all messages stored
    this.get(
      "/",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      this.getMockProducts
    );
  }

  getMockProducts(req, res) {
    try {
      const result = generateProductsMock(100);
      res.sendSuccess(result);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }
}
