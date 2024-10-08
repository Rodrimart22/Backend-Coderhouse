export default class TicketsRepository {
  constructor(dao) {
    this.dao = dao;
  }
  save = async (ticket) => {
    const result = await this.dao.save(ticket);
    return result;
  };
}
