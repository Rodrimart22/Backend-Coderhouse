import mongoose from 'mongoose';
import config from '../config/config.js';

export default class MongoSingleton {
    static #instance;

    constructor() {
        mongoose.connect(config.mongoUrl)
    }

    static getInstance() {
        if(this.#instance) {
            console.log('La conexion ya existe');
            return this.#instance;
        }

        console.log('La conexion no existe, se crea una nueva BDD');
        this.#instance = new MongoSingleton();
        return this.#instance;
    }
}