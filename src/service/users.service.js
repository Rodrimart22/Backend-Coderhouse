import Users from "../dao/dbManagers/users.manager.js";

const usersManager = new Users();

const getUser = async (email) => {
  const result = await usersManager.getByEmail(email);
  return result;
};

const saveUser = async (newUser) => {
  const result = await usersManager.save(newUser);
  return result;
};

export { getUser, saveUser };
