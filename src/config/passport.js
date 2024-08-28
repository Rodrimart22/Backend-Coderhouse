import passport from "passport";
import jwt from "passport-jwt";
import { passportStrategiesEnum } from "./enums.js";
import Users from "../dao/dbManagers/users.manager.js";
import GitHubStrategy from "passport-github2";
import configs from "./config.js";
import { generateToken } from "../utils.js";

const JWTSrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  // passport with jwt
  passport.use(
    passportStrategiesEnum.JWT,
    new JWTSrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        // jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configs.privateKeyJWT,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user); //req.user
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Github Strategy
  passport.use(
    passportStrategiesEnum.GITHUB,
    new GitHubStrategy(
      {
        clientID: configs.githubClientId,
        clientSecret: configs.githubSecret,
        callbackURL: `http://localhost:${configs.port}/api/users/github-callback`,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const UsersModel = new Users();
          const email = profile.emails[0].value;
          const user = await UsersModel.getByEmail(email);

          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              email,
              age: 18,
              role: "USER",
              password: "",
            };

            const result = await UsersModel.save(newUser);

            // const accessToken = generateToken(result)
            return done(null, result); //req.user
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

export default initializePassport;
