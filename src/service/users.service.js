import CartsRepository from "../repositories/carts.repository.js";
import UsersRepository from "../repositories/users.repository.js";
import { decodeToken } from "../utils.js";

const registerUser = async (user) => {
  try {
    const newCart = await CartsRepository.save();
    user.cart_id = newCart._id;
    const newUser = await UsersRepository.saveUser(user);
    return newUser;
  } catch (error) {
    console.error(error.message);
  }
};

const updateUserPassword = async (jwt) => {
  
};

export { registerUser };
