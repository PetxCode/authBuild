import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import authModel from "../model/authModel";

passport.use(
  new Strategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    const user: any = await authModel.findOne({ email });

    if (!user) {
      return done(null, "user/email not found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return done(null, "password incorrect");
    }

    if (!user?.verify) {
      return done(null, "your Account isn't verified yet...!");
    }

    if (user?.verifyToken !== "") {
      return done(null, "your Account isn't verified yet...!");
    }

    return done(null, user);
  })
);

passport.serializeUser(function (user: any, done) {
  done(null, user._id);
});

passport.deserializeUser(function (user: any, done) {
  done(null, user._id);
});
