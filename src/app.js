import express from "express";
// import {productManager}  from "./ProductManager/ProductManager.js";
import productManager from "./ProductManager/ProductManager.js";

// creando el servido http
const app = express();


//Para poder rercibir peticiones en formato JSON
app.use(express.json());

// lista de productos
const manager = new productManager("./files/Products.json");

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const products = await manager.getProducts();

  if (limit == undefined) {
    res.send(products); 
  } else {
    const limitedProducts = products.slice(0, limit);
    res.send(limitedProducts ? limitedProducts : []);
  }
});

app.get("/products/:pid", async (req, res) => {
  const id = +req.params.pid;
  const product = await manager.getProductById(id);

  if (product != null) {
    res.send(product); 
  } else {
    res.send("Error: No se encontro el producto");
  }
});

//Extras para practicar

//Crear un recurso(producto)
app.post("/products", async (req, res) => {
  // Este objeto lo vamos a enviar desde POSTMAN
  const product = req.body;

  const { title, description, price, thumbnail, code, stock } = product;

  if (!title || !description || !price || !thumbnail || !code || !stock) {
    //Error del cliente porque no envia los atributos obligatorios
    return res
      .status(400)
      .send({ status: "error", error: "Valores incompletos" });
  } else {
    await manager.addProduct(title, description, price, thumbnail, code, stock);
    res.status(201).send({ status: "success", message: "product created" });
  }
});

//Actualización de un producto
app.patch("/products/:pid", async (req, res) => {
  //Recibir Id de producto a actualizar
  // Recibir el body de los cambios

  const productBody = req.body;
  const pid = Number(req.params.pid);

  const msg = await manager.updateProduct(pid, productBody);

  if (msg == "Update con Exito") {
    res.send({ status: "success", message: "product updated" });
  } else {
    res.status(404).send({ status: "error", error: "user not found" });
  }
});

app.delete("/products/:pid", async (req, res) => {
  const pid = req.params.pid;

  const msg = await manager.deleteProduct(pid);
  if (msg == "Delete con Exito") {
    res.send({ status: "success", message: "product deleted" });
  } else {
    res.send({ status: "error", message: "product not fount" });
  }
});

//Fin de extras

app.listen(8080, () => {
  console.log("Listening in port 8080");
});
