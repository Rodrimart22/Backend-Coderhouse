import { ticketsModel } from "./models/tickets.models.js";

export default class Tickets {
  constructor() {
    console.log("Working tickets with DB");
  }

  save = async (ticket) => {
    const result = await ticketsModel.create(ticket);
    return result;
  };
}
