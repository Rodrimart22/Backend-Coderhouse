import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import configs from "./config/config.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __mainDirname = path.join(__dirname, ".."); // export de ruta de proyecto general

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

const generateToken = (user, time = "24h") => {
  const token = jwt.sign({ user }, configs.privateKeyJWT, { expiresIn: time });
  return token;
};

const decodeToken = (token, req) => {
  try {
    const decodedToken = jwt.verify(token, configs.privateKeyJWT);
    const expirationDate = new Date(decodedToken.exp * 1000);
    const currentDate = new Date();

    // req.logger.info(decodedToken);

    if (currentDate < expirationDate) {
      return decodedToken;
    } else {
      req.logger.error("El Token ha expirado");
      return null;
    }
  } catch (error) {
    req.logger.error("Error al decodificar/verificar el token");
    console.error(error.message);
  }
};

export {
  __dirname,
  __mainDirname,
  createHash,
  isValidPassword,
  generateToken,
  decodeToken,
};
