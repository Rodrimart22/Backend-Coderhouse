import express from "express";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import __dirname from "./utils.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

try {
  await mongoose.connect(
    "mongodb+srv://martinezmondelli:j1mT8CP8yjC5Iy6z@cluster0.xax460v.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("DB connected");

} catch (error) {
  console.log(error.message);
}

app.listen(8080, () => console.log("Server running"));
