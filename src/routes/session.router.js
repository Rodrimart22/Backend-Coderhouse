import { Router } from "express";
import { usersModel } from "../dao/dbManagers/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

//  Este archivo no esta funcional ni operando 
// pero sirve de guia de como estaban las cosas antes
// con passport-local para register, login, y github funcional
// 

// Register with passport
router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "fail-register",
  }),
  async (req, res) => {
    res.status(201).send({ status: "success", message: "user registered" });
  }
);

// Failure register
router.get("/fail-register", async (req, res) => {
  res.status(500).send({ status: "error", message: "register fail" });
});

// Login with passport
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "fail-login" }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(401)
        .send({ status: "error", message: "invalid credentials" });
    }

    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };

    res.send({ status: "success", message: "login success" });
  }
);

// Fail to login
router.get("/fail-login", async (req, res) => {
  res.status(500).send({ status: "error", message: "login fail" });
});

//Register with Github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.send({ status: "success", message: "user registered" });
  }
);

// Login with Github
router.get(
  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };
    res.redirect("/");
  }
);

// Logout with passport
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error)
      return res.status(500).send({ status: "error", message: error.message });
    res.redirect("/");
  });
});

export default router;
