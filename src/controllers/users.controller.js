import { createHash, generateToken, isValidPassword } from "../utils.js";

import { registerUser } from "../service/users.service.js";

import { Users } from "../dao/factory.js";
import UsersRepository from "../repositories/users.repository.js";

const UsersDao = new Users();
const usersRepository = new UsersRepository(UsersDao);

const register = async (req, res) => {
  try {
    const { first_name, last_name, role, email, password } = req.body;

    if (!first_name || !last_name || !role || !email || !password) {
      return res.sendClientError("incomplete values");
    }

    const existsUser = await usersRepository.getUser(email);

    if (existsUser) {
      return res.sendClientError("user already exists");
    }

    const hashedPassword = createHash(password);

    const newUser = {
      ...req.body,
    };
    newUser.password = hashedPassword;

    const result = await registerUser(newUser);

    res.sendSucessNewResource(result);
  } catch (error) {
    console.log("Error Message");
    res.sendServerError(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendClientError("incomplete values");
    }

    const user = await usersRepository.getUser(email);

    if (!user) {
      return res.sendClientError("incorrect credentials");
    }

    const comparePassword = isValidPassword(password, user.password);

    if (!comparePassword) {
      return res.sendClientError("incorrect credentials");
    }

    const accessToken = generateToken(user);

    // res.sendSuccess(accessToken);
    res
      .cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 })
      .sendSuccess(accessToken);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

// Github Login method
// Not working properly
const githubCallback = async (req, res) => {
  req.user = {
    first_name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
  };

  const accessToken = generateToken(req.user);

  res.sendSuccess(accessToken);
  res.redirect("/");
};

const logout = async (req, res) => {
  req.user.destroy((error) => {
    if (error)
      return res.status(500).send({ status: "error", message: error.message });
    res.redirect("/");
  });
};

export { register, login, githubCallback, logout };
