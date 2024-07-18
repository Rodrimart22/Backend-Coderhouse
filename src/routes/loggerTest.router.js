import Router from "./router.js";

import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";

export default class LoggerTestRouter extends Router {
  constructor() {
    super();
  }

  init() {
    //Obtain all messages stored
    this.get(
      "/",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      this.showLogs
    );
  }

  showLogs(req, res) {
    //custom levels
    req.logger.fatal("Prueba fatal");
    req.logger.error("Prueba error");
    req.logger.warning("Prueba warning");
    req.logger.info("Prueba info");
    req.logger.http("Prueba http");
    req.logger.debug("Prueba debug");

    res.sendSuccess("Aqui se hacen las pruebas de los logs");
  }
}
