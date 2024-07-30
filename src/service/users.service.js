import {
  cartsRepository,
  usersRepository,
} from "../repositories/factoryRepository.js";
import { decodeToken } from "../utils.js";

const registerUser = async (user) => {
  try {
    const newCart = await cartsRepository.save();
    user.cart_id = newCart._id;
    const newUser = await usersRepository.saveUser(user);
    return newUser;
  } catch (error) {
    console.error(error.message);
  }
};

const updateUserPassword = async (jwt) => {
  
};

export { registerUser };
