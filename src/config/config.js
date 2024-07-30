import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program.option("--mode <modo>", "variable de ambiente");
program.parse();

// //DEVELOPMENT, PRODUCTION
const environment = program.opts().mode;

dotenv.config();

// dotenv.config({
//   path: (environment === "DEVELOPMENT") ? "./.env.dev" : "./.env.prod",
// });

const config = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  privateKeyJWT: process.env.PRIVATE_KEY_JWT,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_SECRET,
  persistence: process.env.PERSISTENCE,
  environment: environment ? environment : process.env.ENVIRONMENT,
  userNodemailer: process.env.USER_NODEMAILER,
  passwordNodemailer: process.env.PASSWORD_NODEMAILER,
};
export default config;
