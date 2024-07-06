import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { __dirname } from "./utils.js";
import initializePassport from "./config/passport.js";
import passport from "passport";
import ViewsRouter from "./routes/views.router.js";
import UsersRouter from "./routes/users.router.js";
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";
import MessagesRouter from "./routes/messages.router.js";
import configs from "./config/config.js";
import { Server } from "socket.io";

console.log(`La aplicación se está ejecutando en el puerto ${configs.port}`);

const app = express();

const viewsRouter = new ViewsRouter();
const usersRouter = new UsersRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const messagesRouter = new MessagesRouter();

initializePassport();
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

try {
  await mongoose.connect(configs.mongoUrl);
  console.log("DB connected");
} catch (error) {
  console.log(error.message);
}

try {
  app.use("/", viewsRouter.getRouter());
  app.use("/api/carts", cartsRouter.getRouter());
  app.use("/api/products", productsRouter.getRouter());
  app.use("/api/users", usersRouter.getRouter());
  app.use("/api/messages", messagesRouter.getRouter());
} catch (error) {
  console.log(error.message);
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
