import { productsModel } from '../dbManagers/models/products.model.js';

export default class Products {
    constructor() {
        console.log('Working products with DB');
    }

    getAll = async () => {
        const products = await productsModel.find().lean();
        return products;
    }

    save = async (product) => {
        const result = await productsModel.create(product);
        return result;
    }

    update = async (id, product) => {
        const result = await productsModel.updateOne({ _id: id }, product);
        return result;
    }
}