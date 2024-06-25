export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUser = async (email) => {
    const result = await this.dao.getByEmail(email);
    return result;
  };

  saveUser = async (newUser) => {
    const result = await this.dao.save(newUser);
    return result;
  };
}
