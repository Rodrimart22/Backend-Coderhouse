import Router from "./router.js";
import Carts from "../dao/dbManagers/carts.manager.js";
import Products from "../dao/dbManagers/products.manager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { productsModel } from "../dao/dbManagers/models/products.model.js";
import { Passport } from "passport";

export default class ViewsRouter extends Router {
  constructor() {
    super();
    this.productsManager = new Products();
    this.cartsManager = new Carts();
  }

  init() {
    //Products page
    this.get(
      "/products",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      this.products
    );

    //Cart ID page
    this.get(
      "/carts/:cid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      this.carts
    );

    //Register
    this.get(
      "/register",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      this.register
    );
    //Login 
    this.get(
      "/login",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      (req, res) => {
        res.render("login");
      }
    );
    //Profile
    this.get(
      "/",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      (req, res) => {
        res.render("profile");
      }
    );
  }

  //Render products paginated
  async products(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } =
        await productsModel.paginate({}, { limit, page, lean: true });

      res.render("products", {
        products: docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        page,
        totalPages,
        // user: req.user,
      });
    } catch (error) {
      res.sendServerError(error.message);
    }
  }

  //render specific cart products
  async carts(req, res) {
    try {
      const { cid } = req.params;
      const cart = await this.cartsManager.getOne(cid);
      const products = cart?.[0]?.products || [];
      // console.log(JSON.stringify(products, null, "\t"));

      // Transforma tus datos antes de pasarlos a la vista
      const transformedProducts = products.map((item) => ({
        title: item.product.title,
        price: item.product.price,
        stock: item.product.stock,
        category: item.product.category,
        quantity: item.quantity,
        productId: item.product._id,
      }));

      res.render("carts", { products: transformedProducts });
    } catch (error) {
      res.sendServerError(error.message);
    }
  }

  register(req, res) {
    try {
      res.render("register");
    } catch (error) {
      res.sendServerError(error.message);
    }
    
  }
}
