import mongoose from "mongoose";
import config from "../config/config.js";

let maxRetries = 3; // Número máximo de intentos de conexión
let retryInterval = 5000; // Intervalo entre reintentos en milisegundos

export default class MongoSingleton {
  static #instance;

  constructor() {
    this.connect();
  }

  static async getInstance() {
    if (this.#instance) {
      console.log("La conexión ya existe");
      return this.#instance;
    }

    console.log("La conexión no existe, se crea una nueva BDD");
    let retries = 0;

    while (!this.#instance && retries < maxRetries) {
      try {
        this.#instance = new MongoSingleton();
      } catch (error) {
        retries++;
        console.error(
          `Error al crear la instancia de la base de datos (Intento ${retries}):`,
          error
        );
        // Esperar antes de realizar el siguiente intento
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }

    if (!this.#instance) {
      throw new Error(
        `No se pudo establecer la conexión después de ${retries} intentos.`
      );
    }

    return this.#instance;
  }

  async connect() {
    let connected = false;
    let retries = 0;

    while (!connected && retries < maxRetries) {
      try {
        await mongoose.connect(config.mongoUrl);
        // , {
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true,
        //   // Otras opciones de configuración aquí según sea necesario
        // });
        connected = true;
        console.log("Conexión exitosa a la base de datos.");
      } catch (error) {
        retries++;
        console.error(
          `Error al conectar a la base de datos (Intento ${retries}):`,
          error
        );
        // Esperar antes de realizar el siguiente intento
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }

    if (!connected) {
      throw new Error(
        `No se pudo establecer la conexión después de ${retries} intentos.`
      );
    }
  }
}
