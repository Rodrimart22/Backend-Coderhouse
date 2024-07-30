// Imports of express configuration
import express from "express";
import handlebars from "express-handlebars";
// import mongoose from "mongoose";
import { __dirname } from "./utils.js";
import initializePassport from "./config/passport.js";
import passport from "passport";
import configs from "./config/config.js";
import { Server } from "socket.io";
import { addLogger } from "./utils/logger.js";
//imports of different routers
import ViewsRouter from "./routes/views.router.js";
import UsersRouter from "./routes/users.router.js";
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";
import MessagesRouter from "./routes/messages.router.js";
import MockingProductsRouter from "./routes/mockingproduct.router.js";
import errorHandler from "./middlewares/errors/index.js";
import LoggerTestRouter from "./routes/loggerTest.router.js";

console.log(`La aplicación se está ejecutando en el puerto ${configs.port}`);

const app = express();
app.use(addLogger);

const viewsRouter = new ViewsRouter();
const usersRouter = new UsersRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const messagesRouter = new MessagesRouter();
const mockingProductsRouter = new MockingProductsRouter();
const loggerTestRouter = new LoggerTestRouter();

initializePassport();
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

try {
  app.use("/", viewsRouter.getRouter());
  app.use("/api/carts", cartsRouter.getRouter());
  app.use("/api/products", productsRouter.getRouter());
  app.use("/api/users", usersRouter.getRouter());
  app.use("/api/messages", messagesRouter.getRouter());
  app.use("/mockingproducts", mockingProductsRouter.getRouter());
  app.use("/loggerTest", loggerTestRouter.getRouter());
  app.use(errorHandler);
} catch (error) {
  console.error("Error en la configuración de las rutas:", error.message);
}

const server = app.listen(8080, () => console.log("Server running"));

// Socket io
const socketServer = new Server(server);

// socketServer.on("connection", (socket) => {
//   socket.on("addMessage", async (data) => {
//     try {
//       await messagesManager.save(data);
//       const messages = await messagesManager.getAll();
//       socketServer.emit("updateMessages", messages);
//       // console.log("Mensaje añadido", data);
//     } catch (error) {
//       console.error("Error adding message:", error.message);
//     }
//   });
// });
