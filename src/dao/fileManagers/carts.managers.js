import fs from "fs";

export default class cartManager {
  constructor(path) {
    this.path = path;
  }
  getCarts = async () => {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const carts = data != "" ? JSON.parse(data) : [];
        return carts;
      } else {
        return [];
      }
    } catch (err) {
      console.log(`Error obteniendo los datos de ${this.path} | `, err);
    }
  };

  addCart = async (products = []) => {
    try {
      // obtener lista de cartos
      const carts = await this.getCarts();

      // crear cart con datos proporcionados
      const cart = {
        products,
      };

      // ID auto incrementable y añadir a arr de carts
      cart.id = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
      carts.push(cart);

      // Escribir json con lista actualizada
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));

      return cart;
    } catch (err) {
      console.log(`Error añadiendo carto en ${this.path} | `, err);
    }
  };

  getCartById = async (cartID) => {
    try {
      // obtener lista de cartos
      const carts = await this.getCarts();

      const cartSearch = carts.findIndex((cart) => cart.id === cartID);
      if (cartSearch === -1) {
        new Error("cart no encontrado");
        return null;
      } else {
        return carts[cartSearch];
      }
    } catch (error) {
      console.log(`Error buscando ID de carto en ${this.path} | `, err);
    }
  };

  // updateCart = async (cartID, productId) => {
  //   // const { product } = productId;
  //   try {
  //     // obtener lista de cartos
  //     const carts = await this.getCarts();

  //     const cartSearch = carts.findIndex((cart) => cart.id === cartID);
  //     if (cartSearch === -1) {
  //       new Error("carto No encontrado");
  //       return null;
  //     } else {
  //       const prodSearch = carts[cartSearch].products.findIndex(
  //         (prod) => prod.id === productId
  //       );
  //       if (prodSearch == -1) {
  //         carts[cartSearch].products.productId += 1;
  //       } else {
  //         carts[cartSearch].products.productId = 1;
  //       }

  //       // carts[cartSearch] = updatedcart;

  //       await fs.promises.writeFile(
  //         this.path,
  //         JSON.stringify(carts, null, "\t")
  //       );
  //       return "Update con Exito";
  //     }
  //   } catch (err) {
  //     console.log(
  //       `Error actualizando el carto con ID ${id} en el path:  ${this.path} | `,
  //       err
  //     );
  //   }
  // };

  // deleteCart = async (cartID) => {
  //   try {
  //     // obtener lista de cartos
  //     const carts = await this.getCarts();

  //     const cartSearch = carts.findIndex((prod) => prod.id === cartID);
  //     if (cartSearch === -1) {
  //       new Error("carto No encontrado");
  //       return null;
  //     } else {
  //       carts.splice(cartSearch, 1);

  //       await fs.promises.writeFile(
  //         this.path,
  //         JSON.stringify(carts, null, "\t")
  //       );
  //       return "Delete con Exito";
  //     }
  //   } catch (err) {
  //     console.log(
  //       `Error Borrando el carto con ID ${id} en el path:  ${this.path} | `,
  //       err
  //     );
  //   }
  // };

  saveCart = async (cartsUpdate) => {
    try {
      // obtener lista de cartos y actualizarlos en el archivo
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(cartsUpdate, null, "\t")
      );
      return "Update con Exito";
    } catch (err) {
      console.log(`Error actualizando los carritos:  ${this.path} | `, err);
    }
  };
}
