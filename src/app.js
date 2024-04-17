import express from "express";
import productsRouter from "./routes/products.router.js";
import __dirname from "./utils.js";
import viewsRouter from "./routes/web/views.router.js";
import indexRouter from "./routes/web/index.router.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Servidor archivos estáticos
app.use(express.static(`${__dirname}/public`));

//Motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//Routes
app.use("/realtimeproducts", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/", indexRouter);

const server = app.listen(8080, () => console.log("Server running"));

//Socket io
const io = new Server(server);

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
