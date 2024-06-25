import Products from "../dao/dbManagers/products.manager.js";
const productsManager = new Products();

// Get all products
const getAllProducts = async () => {
  const products = await productsManager.getAll();
  return products;
};
// Create a new product
const createProduct = async (product) => {
  const result = await productsManager.save({
    ...product,
  });
  return result;
};

// Update a product data
const updateProductData = async (pid, product) => {
  const result = await productsManager.update(pid, {
    ...product,
  });
  return result;
};

export { getAllProducts, createProduct, updateProductData };
