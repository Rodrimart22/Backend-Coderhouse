import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import configs from "./config/config.js";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __mainDirname = path.join(__dirname, ".."); // export de ruta de proyecto general

// Configuración de Multer para manejar múltiples archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";

    // Determinar la carpeta de destino según el tipo de documento
    switch (file.fieldname) {
      case "identificacion":
        uploadPath = `${__dirname}/public/documents/identificacion`;
        break;
      case "cuenta":
        uploadPath = `${__dirname}/public/documents/cuenta`;
        break;
      case "domicilio":
        uploadPath = `${__dirname}/public/documents/domicilio`;
        break;
      case "perfil":
        uploadPath = `${__dirname}/public/profiles`;
        break;
      case "producto":
        uploadPath = `${__dirname}/public/products`;
        break;
      default:
        uploadPath = `${__dirname}/public/documents/files`; // Carpeta por defecto si no se especifica un tipo de documento válido
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uuid = uuidv4();
    const filename = `${uuid}-${file.originalname}`;
    cb(null, filename);
  },
});

const uploader = multer({
  storage,
  onError: (err, next) => {
    console.log(err.message);
    next();
  },
});

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
  uploader,
};
