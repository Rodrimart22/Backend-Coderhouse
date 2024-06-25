import { productsModel } from "./models/products.model.js";

export default class Products {
  constructor() {
    console.log("Working products with DB");
  }

  getAll = async () => {
    const products = await productsModel.find().lean();
    return products;
  };
  
  getOne = async (id) => {
    const product = await productsModel.findOne({ _id: id });
    return product;
  };

  save = async (product) => {
    const result = await productsModel.create(product);
    return result;
  };

  update = async (id, product) => {
    const result = await productsModel.updateOne({ _id: id }, product);
    return result;
  };
}
