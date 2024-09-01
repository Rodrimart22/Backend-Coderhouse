// importar dependencia de uuid
import { v4 as uuidv4 } from "uuid";

import TicketsRepository from "../repositories/tickets.repository.js";

const generatePurchase = async (user, amount) => {
  const newTicket = {
    code: uuidv4(),
    purchase_datetime: new Date().toLocaleString(),
    amount,
    purchaser: user.email,
  };

  //usar el ticketRepository para guardad el ticket generado
  return await TicketsRepository.save(newTicket);
};

export { generatePurchase };
