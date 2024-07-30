import { Router as expressRouter } from "express";
import passport from "passport";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { HTTP_STATUS } from "./routerExtra/httpStatus.js";

export default class Router {
  constructor() {
    this.router = expressRouter();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  get(path, policies, strategy, ...callbacks) {
    this.router.get(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, strategy, ...callbacks) {
    this.router.post(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, strategy, ...callbacks) {
    this.router.put(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, strategy, ...callbacks) {
    this.router.delete(
      path,
      this.applyCustomPassportCall(strategy),
      this.handlePolicies(policies),
      this.generateCustomResponse,
      this.applyCallbacks(callbacks)
    );
  }

  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = (data) => {
      res.status(HTTP_STATUS.OK).json({ data });
    };

    res.sendSucessNewResource = (data) => {
      res.status(HTTP_STATUS.CREATED).json({ data });
    };

    res.sendClientError = (error) => {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ error });
    };

    res.sendNotAcceptable = (error) => {
      res.status(HTTP_STATUS.NOT_ACCEPTABLE).json({ error });
    };

    res.sendServerError = (error) => {
      res.status(HTTP_STATUS.SERVER_ERROR).json({ error });
    };

    next();
  };

  applyCustomPassportCall = (strategy) => (req, res, next) => {
    if (strategy === passportStrategiesEnum.JWT) {
      //CUSTOM PASSPORT CALL
      passport.authenticate(strategy, function (err, user, info) {
        if (err) return next(err);
        if (!user) {
          return res.status(HTTP_STATUS.UNAUTHORIZED).send({
            error: info.messages ? info.messages : info.toString(),
          });
        }
        req.user = user;
        next();
      })(req, res, next);
    } else if (strategy === passportStrategiesEnum.GITHUB) {
      passport.authenticate(strategy, { failureRedirect: "/login" })(
        req,
        res,
        next
      );
      next();
    } else {
      next();
    }
  };

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === accessRolesEnum.PUBLIC) return next();

    const user = req.user;

    if (!policies.includes(user.role.toUpperCase()))
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ error: "not permissions" });
    next();
  };

  applyCallbacks(callbacks) {
    //mapear los callbacks 1 a 1, obteniendo sus parametros (req,res)
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        console.error(error.message);
        // params[1].status(HTTP_STATUS.SERVER_ERROR).json({
        //   status: "error",
        //   message: "Internal Server Error",
        //   originalError: error.message,
        // });
      }
    });
  }
}
