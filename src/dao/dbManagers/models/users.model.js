import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: Number,
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["USER", "ADMIN", "PREMIUM"],
    default: "USER",
  },
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  documents: {
    type: [
      {
        name: String,
        reference: String,
      },
    ],
    default: [],
  },
  last_connection: {
    type: Date,
    default: function () {
      const offset = new Date().getTimezoneOffset();
      const localTime = new Date(Date.now() - offset * 60000);
      return localTime.toISOString();
    },
  },
});

userSchema.pre(["find", "findOne"], function () {
  this.populate("cart_id.cart");
});

export const usersModel = mongoose.model(userCollection, userSchema);
