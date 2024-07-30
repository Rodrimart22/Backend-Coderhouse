import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {
  register,
  login,
  updateRole,
  githubCallback,
  logout,
  checkAndSend, updatePassword
} from "../controllers/users.controller.js";

export default class UsersRouter extends Router {
  constructor() {
    super();
  }

  init() {
    this.get(
      "/",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      async (req, res) => {
        res.sendSuccess("get Users working");
      }
    );
    this.post(
      "/login",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      login
    );
    this.post(
      "/register",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      register
    );

    this.get(
      "/premium/:uid",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      updateRole
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
      githubCallback
    );
    // Logout with passport
    this.get(
      "/logout",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.GITHUB,
      logout
    );

    this.post(
      "/pass-recovery",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      checkAndSend
    );

    this.post(
      "/pass-update",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      updatePassword
    );
  }
}
