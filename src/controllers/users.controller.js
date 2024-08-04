import {
  createHash,
  decodeToken,
  generateToken,
  isValidPassword,
} from "../utils.js";
import { registerUser } from "../service/users.service.js";
import EErrors from "../middlewares/errors/enums.js";
import CustomError from "../middlewares/errors/CustomError.js";

import { usersRepository } from "../repositories/factoryRepository.js";
import { sendEmail } from "../service/mail.service.js";
import { changePasswordHtml } from "../utils/changePassword.html.js";

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
      throw CustomError.createError({
        name: "UserError",
        cause: "Invalid data types, email and password required",
        message: "Error trying to create user",
        code: EErrors.INVALID_TYPE_ERROR,
      });
      // return res.sendClientError("incomplete values");
    }

    const user = await usersRepository.getUser(email);

    if (!user) {
      return res.sendClientError("Credenciales incorrectas");
    }

    const comparePassword = isValidPassword(password, user.password);

    if (!comparePassword) {
      return res.sendClientError("Credenciales incorrectas");
    }

    const accessToken = generateToken(user);

    res
      .cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 })
      .sendSuccess(accessToken);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const updateRole = async (req, res) => {
  try {
    const user = await usersRepository.getUser(req.user.email);

    if (!user) {
      // throw CustomError.createError({
      //   name: "UserError",
      //   cause: "User not found",
      //   message: "Error trying to update user access",
      //   code: EErrors.USER_NOT_FOUND,
      // });
      res.sendNotFound("Usuario no encontrado");
    }

    const newRole = { role: user.role == "PREMIUM" ? "USER" : "PREMIUM" };
    const userUpdated = await usersRepository.updateUser(
      req.user.email,
      newRole
    );
    req.logger.info(`User updated to role: ${newRole.role}`);
    res.sendSuccess(userUpdated);
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

const checkAndSend = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.sendClientError("Incomplete values");
    }

    const user = await usersRepository.getUser(email);

    if (!user) {
      return res.sendClientError("User not found");
    }

    const Token = generateToken(
      {
        name: user?.name,
        email: user.email,
      },
      "1h"
    );

    const emailPasswordChange = {
      to: user.email,
      subject: "Cambia la contraseña",
      html: changePasswordHtml(Token),
    };

    sendEmail(emailPasswordChange);
    res
      // .cookie("pass-recovery", Token, { httpOnly: true, maxAge: 3600000 })
      .sendSuccess(`Correo enviado exitosamente a ${user.email}`);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const { user } = decodeToken(token);
    req.logger.debug(user);
    if (!user) {
      req.logger.error("Token expired");
      res.sendUnauthorized("Token expired");
    }
    const dbUser = await usersRepository.getUser(user.email);
    req.logger.debug(dbUser);
    if (!dbUser) res.sendNotFound("User not found");
    const isNew = isValidPassword(password, dbUser.password);
    if (isNew) {
      req.logger.error(
        "La nueva contraseña no puede ser la misma que la anterior"
      );
      res.sendNotAcceptable(
        "La nueva contraseña no puede ser la misma que la anterior"
      );
    }
    const newPassword = createHash(password);
    await usersRepository.updateUser(dbUser.email, { password: newPassword });
    res.sendSuccess("Contraseña actualizada con exito");
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

export {
  register,
  login,
  updateRole,
  githubCallback,
  logout,
  checkAndSend,
  updatePassword,
};
