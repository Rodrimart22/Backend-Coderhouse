import Router from "./router.js";
import Products from "../dao/dbManagers/products.manager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";

export default class ProductsRouter extends Router {
  constructor() {
    super();
    this.productsManager = new Products();
  }

  init() {
    // get all product
    this.get(
      "/",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      this.getAll
    );
    // post a product
    this.post(
      "/",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      this.newProduct
    );
    // Update a product data
    this.put(
      "/:pid",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      this.updateProduct
    );
  }

  // Get all products
  async getAll(req, res) {
    try {
      const products = await this.productsManager.getAll();
      res.sendSuccess(products);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }
  // Create a new product
  async newProduct(req, res) {
    try {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = req.body;
      if (
        !title ||
        !description ||
        !code ||
        !price ||
        !status ||
        !stock ||
        !category
      ) {
        res.sendClientError("Incomplete data");
      }

      const result = await this.productsManager.save({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      });

      res.sendSuccess(result);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }

  // Update a product data
  async updateProduct(req,res) {
    try {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = req.body;
      const { pid } = req.params;
      if (
        !title ||
        !description ||
        !code ||
        !price ||
        !status ||
        !stock ||
        !category
      ){
        res.sendClientError("Imcomplete data");
      }
      const result = await this.productsManager.update(pid, {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      });
  
      res.sendSuccess(result)

    } catch (error) {
      res.sendServerError(error.message);
    }

  }


} // end

