import express from "express";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/session.router.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

try {
  await mongoose.connect(
    "mongodb+srv://martinezmondelli:j1mT8CP8yjC5Iy6z@cluster0.xax460v.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("DB connected");
} catch (error) {
  console.log(error.message);
}

app.use(
  session({
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      ttl: 3600,
    }),
    secret: "Coder5575Secret",
    resave: true, //nos sirve para poder refrescar o actualizar la sesión luego de un de inactivadad
    saveUninitialized: true, //nos sirve para desactivar el almacenamiento de la session si el usuario aún no se ha identificado o aún no a iniciado sesión
    // cookie: {
    //     maxAge: 30000
    // }
  })
);

app.use("/", viewsRouter);

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionsRouter);

app.listen(8080, () => console.log("Server running"));
