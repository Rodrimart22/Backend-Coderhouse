export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async () => {
    const result = await this.dao.getAll();
    return result;
  };

  getOne = async (cid) => {
    const result = await this.dao.getOne(cid);
    return result;
  };

  save = async () => {
    const result = await this.dao.save();
    return result;
  };

  // Update the cart with products
  putProducts = async (cid, products) => {
    const result = await this.dao.updateProducts(cid, products);
    return result;
  };

  //Add one product
  addOneProduct = async (cid, pid) => {
    const result = await this.dao.addOneProduct(cid, pid);
    return result;
  };

  // Update one cart product quantity
  putQuantity = async (cid, pid, quantity) => {
    const result = await this.dao.updateOneProduct(cid, pid, quantity);
    return result;
  };

  //Clear cart of products
  clearCart = async (cid) => {
    const result = await this.dao.clearCart(cid);
    return result;
  };

  // Delete an specific product of a cart
  deleteProduct = async (cid, pid) => {
    const result = await this.dao.deleteCartProduct(cid, pid);
    return result;
  };

  //Delete all products of the cart
  deleteCart = async (cid) => {
    const result = await this.dao.clearCart(cid);
    return result;
  };
}
