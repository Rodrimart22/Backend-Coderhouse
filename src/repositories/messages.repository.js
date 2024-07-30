export default class MessagesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async () => {
    const result = await this.dao.getAll();
    return result;
  };

  saveMessage = async (message) => {
    const result = await this.dao.save(message);
    return result;
  };
}
