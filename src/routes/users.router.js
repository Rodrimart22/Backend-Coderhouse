import Router from "./router.js";
import Users from "../dao/dbManagers/users.manager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { createHash, generateToken, isValidPassword } from "../utils.js";

export default class UsersRouter extends Router {
  constructor() {
    super();
    this.usersManager = new Users();
  }

  init() {
    this.get(
      "/",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      async (req, res) => {
        res.sendSuccess("get working");
      }
    );
    this.post(
      "/login",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      this.login
    );
    this.post(
      "/register",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      this.register
    );
    this.get(
      "/github",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.GITHUB,
      async (req, res) => {
        res.sendSuccess("Logged with github");
      }
    );
    // Login with Github
    this.get(
      "/github-callback",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.GITHUB,
      async (req, res) => {
        req.user = {
          first_name: `${req.user.first_name} ${req.user.last_name}`,
          email: req.user.email,
          age: req.user.age,
          role: req.user.role,
        };

        const accessToken = generateToken(req.user);

        res.sendSuccess(accessToken);
        res.redirect("/");
      }
    );
    // Logout with passport
    this.get(
      "/logout",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.GITHUB,
      (req, res) => {
        req.user.destroy((error) => {
          if (error)
            return res
              .status(500)
              .send({ status: "error", message: error.message });
          res.redirect("/");
        });
      }
    );
  }

  async register(req, res) {
    try {
      const { first_name, last_name, role, email, password } = req.body;

      if (!first_name || !last_name || !role || !email || !password) {
        return res.sendClientError("incomplete values");
      }

      const existsUser = await this.usersManager.getByEmail(email);

      if (existsUser) {
        return res.sendClientError("user already exists");
      }

      const hashedPassword = createHash(password);

      const newUser = {
        ...req.body,
      };


      console.log(newUser);

      newUser.password = hashedPassword;

      const result = await this.usersManager.save(newUser);

      res.sendSucessNewResource(result);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.sendClientError("incomplete values");
      }

      const user = await this.usersManager.getByEmail(email);

      if (!user) {
        return res.sendClientError("incorrect credentials");
      }

      const comparePassword = isValidPassword(password, user.password);

      if (!comparePassword) {
        return res.sendClientError("incorrect credentials");
      }

      const accessToken = generateToken(user);

      res.sendSuccess(accessToken);
    } catch (error) {
      res.sendServerError(error.message);
    }
  }
}
