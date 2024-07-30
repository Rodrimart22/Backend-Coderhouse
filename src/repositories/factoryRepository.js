// Import All Factories
import UsersRepository from "./users.repository.js";
import MessagesRepository from "./messages.repository.js";
import ProductsRepository from "./products.repository.js";
import CartsRepository from "./carts.repository.js";
import TicketRepository from "./tickets.repository.js";

// Import DAO used from Factory
import { Carts, Products, Users, Messages, Tickets } from "../dao/factory.js";

// Create each DAO instance
const CartsDao = new Carts();
const ProductsDao = new Products();
const UsersDao = new Users();
const MessagesDao = new Messages();
const TicketsDao = new Tickets();

// Instance Each Repository with each DAO
const cartsRepository = new CartsRepository(CartsDao);
const usersRepository = new UsersRepository(UsersDao);
const messagesRepository = new MessagesRepository(MessagesDao);
const productsRepository = new ProductsRepository(ProductsDao);
const ticketsRepository = new TicketRepository(TicketsDao);

// Export all repositories instances
export {
  cartsRepository,
  usersRepository,
  messagesRepository,
  productsRepository,
  ticketsRepository,
};
