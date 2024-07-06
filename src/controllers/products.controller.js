import { Products } from "../dao/factory.js";
import ProductsRepository from "../repositories/products.repository.js";

const ProductsDao = new Products();
const productsRepository = new ProductsRepository(ProductsDao);

// Get all products
const getAll = async (req, res) => {
  try {
    const products = await productsRepository.getAllProducts();
    res.sendSuccess(products);
  } catch (error) {
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
    });

    res.sendSuccess(result);
  } catch (error) {
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
      res.sendClientError("Imcomplete data");
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
    const product = await productsRepository.deleteProduct(pid);
    res.sendSuccess(product);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

export { getAll, getOne, newProduct, updateProduct, deleteProduct };
