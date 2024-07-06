import Router from "./router.js";

import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, saveMessage } from "../controllers/messages.controller.js";

export default class MessagesRouter extends Router {
  constructor() {
    super();
  }

  init() {
    //Obtain all messages stored
    this.get(
      "/",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      getAll
    );

    // Store a new Message
    this.post(
      "/",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      saveMessage
    );
  }
}
