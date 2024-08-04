import { productsRepository } from "../repositories/factoryRepository.js";

// Get all products
const getAll = async (req, res) => {
  try {
    const products = await productsRepository.getAllProducts();
    res.sendSuccess(products);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};
// Get one products
const getOne = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsRepository.getOneProduct(pid);
    res.sendSuccess(product);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};
// Create a new product
const newProduct = async (req, res) => {
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

    const result = await productsRepository.createProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
      owner: req.user.role == "PREMIUM" ? req.user.email : "ADMIN",
    });

    res.sendSuccess(result);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

// Update a product data
const updateProduct = async (req, res) => {
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
    ) {
      req.logger.error("Update de productos con información incompleta");
      res.sendClientError("Imcomplete data");
    }
    if (req.user.role == "PREMIUM") {
      const product = await productsRepository.getOneProduct(pid);
      if (product.owner !== req.user.email) {
        req.logger.warning("No tienes permisos de modificar el producto.");
        res.sendUnauthorized("User Access are not valid for this product.");
      }
    }

    const result = await productsRepository.updateProduct(pid, {
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
};

// Delete one products
const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    if (req.user.role == "PREMIUM") {
      const product = await productsRepository.getOneProduct(pid);
      if (product.owner !== req.user.email) {
        req.logger.warning("No tienes permisos de modificar el producto.");
        res.sendUnauthorized("User Access are not valid for this product.");
      }
    }

    const product = await productsRepository.deleteProduct(pid);
    res.sendSuccess(product);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

export { getAll, getOne, newProduct, updateProduct, deleteProduct };
