import passport from "passport";
import jwt from "passport-jwt";
import { passportStrategiesEnum } from "./enums.js";
import Users from "../dao/dbManagers/users.manager.js";
import GitHubStrategy from "passport-github2";
import {
  PRIVATE_KEY_JWT,
  GITHUB_CLIENT_ID,
  GITHUB_SECRET,
} from "./constants.js";
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
        secretOrKey: PRIVATE_KEY_JWT,
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
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const UsersModel = new Users();
          const email = profile.emails[0].value;
          const user = await UsersModel.getByEmail(email)

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

  //Serializaccion y DeSerializaccion
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
