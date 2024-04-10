import fs from "fs";

export default class productManager {
  constructor(path) {
    this.path = path;
  }
  getProducts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const products = data != "" ? JSON.parse(data) : [];
        return products;
      } else {
        return [];
      }
    } catch (err) {
      console.log(`Error obteniendo los datos de ${this.path} | `, err);
    }
  };

  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status = true,
    category
  ) => {
    try {
      // obtener lista de productos
      const products = await this.getProducts();

      // Verificar si el codigo ingresado existe
      const codeExist = products.find((p) => p.code === code);
      if (codeExist) {
        console.log("El codigo ya existe! \n Intentet con uno diferente");
        return;
      }
      // crear producto con datos proporcionados
      const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      };

      // ID auto incrementable y añadir a arr de products
      product.id =
        products.length === 0 ? 1 : products[products.length - 1].id + 1;
      products.push(product);

      // Escribir json con lista actualizada
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );

      return product;
    } catch (err) {
      console.log(`Error añadiendo producto en ${this.path} | `, err);
    }
  };

  getProductById = async (productID) => {
    try {
      // obtener lista de productos
      const products = await this.getProducts();

      const productSearch = products.findIndex((prod) => prod.id === productID);
      if (productSearch === -1) {
        new Error("Producto No encontrado");
        return null;
      } else {
        return products[productSearch];
      }
    } catch (error) {
      console.log(`Error buscando ID de producto en ${this.path} | `, err);
    }
  };

  updateProduct = async (productID, objActualizado) => {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    } = objActualizado;

    try {
      // obtener lista de productos
      const products = await this.getProducts();

      const productSearch = products.findIndex((prod) => prod.id === productID);
      if (productSearch === -1) {
        new Error("Producto No encontrado");
        return null;
      } else {
        const updatedProduct = {
          ...products[productSearch],
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(price !== undefined && { price }),
          ...(thumbnail !== undefined && { thumbnail }),
          ...(code !== undefined && { code }),
          ...(stock !== undefined && { stock }),
          ...(status !== undefined && { status }),
          ...(category !== undefined && { category }),
        };
        // console.log(updatedProduct);

        products[productSearch] = updatedProduct;

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
        return true;
      }
    } catch (err) {
      console.log(
        `Error actualizando el producto con ID ${id} en el path:  ${this.path} | `,
        err
      );
    }
  };

  deleteProduct = async (productID) => {
    try {
      // obtener lista de productos
      const products = await this.getProducts();

      const productSearch = products.findIndex((prod) => prod.id === productID);
      if (productSearch === -1) {
        new Error("Producto No encontrado");
        return null;
      } else {
        products.splice(productSearch, 1);

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
        return "Delete con Exito";
      }
    } catch (err) {
      console.log(
        `Error Borrando el producto con ID ${id} en el path:  ${this.path} | `,
        err
      );
    }
  };
}
