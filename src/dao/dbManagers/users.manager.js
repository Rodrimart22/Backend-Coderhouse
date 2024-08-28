import { usersModel } from "./models/users.model.js";

export default class Users {
  constructor() {
    console.log("Working users with DB");
  }

  getAllUsers = async () => {
    const user = await usersModel.find();
    return user;
  };

  getOldUsers = async (date) => {
    const result = await usersModel.find({ last_connection: { $lt: date } });
    return result;
  };

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

  deleteByEmail = async (email) => {
    const user = await usersModel.deleteOne({ email }).lean();
    return user;
  };

  deleteOldUsers = async (date) => {
    const result = await usersModel.deleteMany({
      $or: [
        { last_connection: { $lt: date } }, 
        { last_connection: { $exists: false } }, 
      ],
    });
    return result;
  };
}
