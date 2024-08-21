import UsersDto from "../DTOs/users.dto.js";

export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUser = async (email) => {
    const user = await this.dao.getByEmail(email);
    await this.updateUser(email, { last_connection: new Date().toISOString() });
    const result = user !== null && new UsersDto(user);
    return result;
  };

  getUserData = async (email) => {
    const user = await this.dao.getByEmail(email);
    return user;
  };

  updateUser = async (email, data) => {
    await this.dao.updateUser(email, data);
    const user = await this.dao.getByEmail(email);
    const result = user !== null && new UsersDto(user);
    return user;
  };

  saveUser = async (newUser) => {
    const result = await this.dao.save(newUser);
    return result;
  };
}
