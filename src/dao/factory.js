import config from "../config/config.js";
const persistence = config.persistence;

let Carts;
let Products;
let Users;
let Messages;
let Tickets;

switch (persistence) {
  case "MONGO":
    console.log("Trabajando con BDD");
    //Import dinámicos de Conexion con DB y Clases Mongo.
    const { default: mongo } = await import("./singletonMongo.js");
    mongo.getInstance();
    const { default: CartsMongo } = await import(
      "./dbManagers/carts.manager.js"
    );
    Carts = CartsMongo;
    const { default: ProductsMongo } = await import(
      "./dbManagers/products.manager.js"
    );
    Products = ProductsMongo;
    const { default: UsersMongo } = await import(
      "./dbManagers/users.manager.js"
    );
    Users = UsersMongo;
    const { default: MessagesMongo } = await import(
      "./dbManagers/messages.manager.js"
    );
    Messages = MessagesMongo;
    const { default: TicketsMongo } = await import(
      "./dbManagers/tickets.manager.js"
    );
    Tickets = TicketsMongo;

    break;
  case "MEMORY":
    console.log("Trabajando con memoria");
    const { default: ContactsMemory } = await import(
      "./memory/contacts.memory.js"
    );
    Contacts = ContactsMemory;
    break;
}

export { Carts, Products, Users, Messages, Tickets };
