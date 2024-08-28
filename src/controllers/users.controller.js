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
import { accountDeletedHtml } from "../utils/accountDeleted.html.js";
import mongoose from "mongoose";

// Register a new user
const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
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

// Process to login an existing user
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
    }

    const user = await usersRepository.getUser(email);

    if (!user) {
      return res.sendClientError("Credenciales incorrectas");
    }

    const comparePassword = isValidPassword(password, user.password);

    if (!comparePassword) {
      return res.sendClientError("Credenciales incorrectas");
    }

    // Actualizar para devolver jwt sin password
    const accessToken = generateToken(user);
    await usersRepository.updateUser(user.email, {
      last_connection: new Date().toISOString(),
    });

    res
      .cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600000 })
      .sendSuccess(accessToken);
  } catch (error) {
    res.sendServerError(error.message);
  }
};

// Process to update user role to premium
const updateRole = async (req, res) => {
  try {
    const user = await usersRepository.getUserData(req.user.email);

    if (!user) {
      res.sendNotFound("Usuario no encontrado");
    }

    if (user.role === "USER") {
      const expectedDocuments = ["domicilio", "cuenta", "identificacion"];

      // Obtener los nombres de los documentos del user
      const userDocs = user.documents.map((obj) => obj.name);

      for (const docName of expectedDocuments) {
        if (!userDocs.includes(docName)) {
          res.sendUnauthorized("Documentation not completed");
          return;
        }
      }
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

// Process to update and save a document from the user.
const updateDocuments = async (req, res) => {
  try {
    // Obtener datos del usuario y sus documentos
    const user = await usersRepository.getUserData(req.user.email);
    if (!user) {
      res.sendNotFound("Usuario no encontrado");
    }

    const userDocuments = user.documents;

    const documentsNames = [];
    for (const fieldname in req.files) {
      const file = req.files[fieldname][0];
      documentsNames.push({ name: file.fieldname, reference: file.filename });
    }
    const combinedDocuments = [...documentsNames, ...userDocuments];

    const uniqueDocuments = [];
    for (const object of combinedDocuments) {
      if (!uniqueDocuments.find((obj) => obj.name === object.name)) {
        uniqueDocuments.push(object);
      }
    }

    req.logger.info(uniqueDocuments);

    const userUpdated = await usersRepository.updateUser(req.user.email, {
      documents: [...uniqueDocuments],
    });

    // console.dir(userUpdated?.documents);
    req.logger.info(`User updated: ${userUpdated?.documents}`);
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

// Process to send password change email.
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

// Process to update password by received email
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

// Process to update user password
const updateUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) res.sendClientError("No user found");
    const user = await usersRepository.updateUser(email, { role: role });
    res.sendSuccess(user);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await usersRepository.getAllUsers();

    if (!allUsers) {
      return res.sendClientError("No Users found");
    }

    res.sendSuccess(allUsers);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

// Delete inactive users
const deleteNoActive = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const oldUsers = await usersRepository.getOldUsers();

    if (oldUsers.length === 0) {
      res.sendSuccess("No se encontraron usuarios inactivos.");
      return;
    }

    const emailPromises = oldUsers.map(async (user) => {
      const accountDeleted = {
        to: user.email,
        subject: "Eliminado por Inactividad",
        html: accountDeletedHtml(),
      };

      await sendEmail(accountDeleted);
      await usersRepository.deleteUser(user.email);
      return;
    });
    await Promise.all(emailPromises);

    req.logger.info("Correo enviado a todos los usuarios");

    await session.commitTransaction();

    res.sendSuccess("Usuarios inactivos eliminados");
  } catch (error) {
    await session.abortTransaction();

    req.logger.error(error.message);
    res.sendServerError(error.message);
  } finally {
    session?.endSession();
  }
};

// Delete user by email
const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) res.sendNotFound("No user found");
    const user = await usersRepository.deleteUser(email);
    res.sendSuccess(user);
  } catch (error) {
    req.logger.error(error.message);
    res.sendServerError(error.message);
  }
};

// Get user by email
const getCartByEmail = async (req, res) => {
  try {
    const user = req.user;
    if (!user) res.sendNotFound("No user found");
    const userData = await usersRepository.getUserData(user.email);
    res.sendSuccess(userData.cart_id);
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
  updateDocuments,
  getAllUsers,
  deleteNoActive,
  deleteUser,
  updateUser,
  getCartByEmail,
};
