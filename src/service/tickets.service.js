// importar dependencia de uuid
import { v4 as uuidv4 } from "uuid";

import { TicketRepository } from "../repositories/tickets.Repository.js";

const generatePurchase = async (user, amount) => {
  const newTicket = {
    code: uuidv4(),
    purchase_datetime: new Date().toLocaleString(),
    amount,
    purchaser: user.email,
  };

  //usar el ticketRepository para guardad el ticket generado
  return await TicketRepository.save(newTicket);
};

export { generatePurchase };
