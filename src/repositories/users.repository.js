import UsersDto from "../DTOs/users.dto.js";

export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUser = async (email) => {
    const user = await this.dao.getByEmail(email);
    const result = user !== null && new UsersDto(user);
    return result;
  };

  saveUser = async (newUser) => {
    const result = await this.dao.save(newUser);
    return result;
  };


}
