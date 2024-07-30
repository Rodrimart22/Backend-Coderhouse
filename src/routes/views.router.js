import Router from "./router.js";
import Carts from "../dao/dbManagers/carts.manager.js";
import Products from "../dao/dbManagers/products.manager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { productsModel } from "../dao/dbManagers/models/products.model.js";
import { sendEmail } from "../service/mail.service.js";
import { decodeToken } from "../utils.js";

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
        res.render("profile", {
          user: req.user,
        });
      }
    );
    //Send email to change password
    this.get(
      "/password-email",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      this.passwordEmail
    );

    //Send email to change password
    this.get(
      "/password-change",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      this.changePasword
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

  async passwordEmail(req, res) {
    try {
      res.render("forgotPassword");
    } catch (error) {
      res.sendServerError(error.message);
    }
  }

  async changePasword(req, res) {
    try {
      const token = req.query.token;
      const data = decodeToken(token, req);
      // req.logger.info(data);
      if (!data) {
        res.status(404).render("404", {
          title: "Página no encontrada, su token expiro",
        });
      }
      res.render("changePassword", {
        name: data?.user?.name,
      });
    } catch (error) {
      res.sendServerError(error.message);
    }
  }
}
