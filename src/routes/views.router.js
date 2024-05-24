import { Router } from "express";
import Carts from "../dao/dbManagers/carts.manager.js";
import { productsModel } from "../dao/dbManagers/models/products.model.js";

const router = Router();

const cartsManager = new Carts();

//Middleware para comprobacion de acceso
const publicAccess = (req, res, next) => {
  if(req.session?.user) return res.redirect('/products');
  next();
}

const privateAccess = (req, res, next) => {
  if(!req.session?.user) return res.redirect('/login');
  next();
}

router.get('/register', publicAccess, (req, res) => {
  res.render('register')
});

router.get('/login', publicAccess, (req, res) => {
  res.render('login')
});

router.get('/', privateAccess, (req, res) => {
  res.render('profile', {
      user: req.session.user
  })
});

router.get("/products",privateAccess , async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } =
      await productsModel.paginate({}, { limit, page, lean: true });

    res
      .render("products", {
        products: docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        page,
        totalPages,
        user: req.session.user
      })
      .send({
        status: "success",
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: `/products-view?page=${prevPage}`,
        nextLink: `/products-view?page=${nextPage}`,
      });
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsManager.getOne(cid);
    const products = cart?.[0]?.products || [];
    console.log(JSON.stringify(products, null, "\t"));

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
    console.error(error.message);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
