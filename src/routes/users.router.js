import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {
  register,
  login,
  getCartByEmail,
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
} from "../controllers/users.controller.js";
import { uploader } from "../utils.js";

export default class UsersRouter extends Router {
  constructor() {
    super();
  }

  init() {
    // Simple get to check if API working properly
    this.get(
      "/",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      async (req, res) => {
        res.sendSuccess("get Users working");
      }
    );
    // Get the user cart Id by email 
    this.get(
      "/email",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      getCartByEmail
    );
    // Login process of a user
    this.post(
      "/login",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      login
    );
    // Register process of a new user
    this.post(
      "/register",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      register
    );
    // Add documents stored to a user by Id 
    this.post(
      "/:uid/documents",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      // uploader.single("thumbnail"),
      uploader.fields([
        { name: "identificacion", maxCount: 1 },
        { name: "cuenta", maxCount: 1 },
        { name: "domicilio", maxCount: 1 },
        { name: "perfil", maxCount: 1 },
        { name: "products", maxCount: 1 },
      ]),
      updateDocuments
    );

    // Change user to premium and viceversa process 
    this.get(
      "/premium/:uid",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      updateRole
    );

    // Process not working to login with github
    this.get(
      "/github",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.GITHUB,
      async (req, res) => {
        res.sendSuccess("Logged with github");
      }
    );

    // Login with Github -- Not Working
    this.get(
      "/github-callback",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.GITHUB,
      githubCallback
    );
    // Logout with passport -- Not Working
    this.get(
      "/logout",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.GITHUB,
      logout
    );

    // Process to create password recovery email to user
    this.post(
      "/pass-recovery",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      checkAndSend
    );

    // Process to update user password
    this.post(
      "/pass-update",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      updatePassword
    );

    // Process to obtain all users 
    this.get(
      "/all-users",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      getAllUsers
    );

    // Process to update the role of a user 
    this.put(
      "/update-role",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      updateUser
    );
    // Process to delete an user by email 
    this.delete(
      "/delete-user/:email",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      deleteUser
    );
    // Process to delete all inactive users. *
    this.delete(
      "/no-active",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      deleteNoActive
    );
  }
}
