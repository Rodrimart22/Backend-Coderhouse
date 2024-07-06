export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  // Get all products
  getAllProducts = async () => {
    const products = await this.dao.getAll();
    return products;
  };

  getOneProduct = async (pid) => {
    const product = await this.dao.getOne(pid);
    return product;
  }

  // Create a new product
  createProduct = async (product) => {
    const result = await this.dao.save({
      ...product,
    });
    return result;
  };

  // Update a product data
  updateProduct = async (pid, product) => {
    const result = await this.dao.update(pid, {
      ...product,
    });
    return result;
  };

  // Delete one product
  deleteProduct = async (pid) => {
    const product = await this.dao.delete(pid);
    return product;
  }
}
