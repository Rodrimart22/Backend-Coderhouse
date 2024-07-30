import { usersModel } from "./models/users.model.js";

export default class Users {
  constructor() {
    console.log("Working users with DB");
  }

  getByEmail = async (email) => {
    const user = await usersModel.findOne({ email }).lean();
    return user;
  };

  updateUser = async (email, data) => {
    const user = await usersModel.updateOne({ email }, data);
    return user;
  };

  save = async (user) => {
    const result = await usersModel.create(user);
    return result;
  };
}
