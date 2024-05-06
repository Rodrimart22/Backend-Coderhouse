import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  // id: {
  //   type: Number,
  //   required: true,
  // },
  products: {
    type: Array,
    required: true,
    default: [],
  },
});

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
