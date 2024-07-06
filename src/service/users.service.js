import { Users } from "../dao/factory.js";
import UsersRepository from "../repositories/users.repository.js";
import { Carts } from "../dao/factory.js";
import CartsRepository from "../repositories/carts.repository.js";

const UsersDao = new Users();
const usersRepository = new UsersRepository(UsersDao);
const CartsDao = new Carts();
const cartsRepository = new CartsRepository(CartsDao);

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

export { registerUser };
