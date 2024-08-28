import UsersDto from "../DTOs/users.dto.js";
import privateUsersDto from "../DTOs/privateUser.dto.js";

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

  getAllUsers = async () => {
    const users = await this.dao.getAllUsers();
    const newUsers = users.map((user) => new privateUsersDto(user));
    return newUsers;
  };

  getOldUsers = async () => {
    const date = this.getTime();
    const users = await this.dao.getOldUsers(date);
    const newUsers = users.map((user) => new privateUsersDto(user));
    return newUsers;
  };

  getUserData = async (email) => {
    const user = await this.dao.getByEmail(email);
    return user;
  };

  updateUser = async (email, data) => {
    await this.dao.updateUser(email, data);
    const user = await this.dao.getByEmail(email);
    const result = user !== null && new privateUsersDto(user);
    return result;
  };

  saveUser = async (newUser) => {
    const result = await this.dao.save(newUser);
    return result;
  };

  deleteUser = async (email) => {
    const user = await this.dao.deleteByEmail(email);
    return user;
  };

  deleteOld = async () => {
    const date = this.getTime();
    const users = await this.dao.deleteOldUsers(date);
    return users;
  };

  getTime = () => {
    // const TWO_DAYS_IN_MILLISECONDS = 2 * 24 * 60 * 60 * 1000;
    const currentTime = new Date();
    currentTime.setDate(currentTime.getDate() - 2); // Restar 2 días
    return currentTime.toISOString();
  };
}
