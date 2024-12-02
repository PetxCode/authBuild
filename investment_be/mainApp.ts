import { Application, NextFunction, Request, Response } from "express";
import user from "./router/authRouter";
import transfer from "./router/transactionRouter";
import passport from "passport";

export const mainApp = (app: Application) => {
  try {
    app.use("/api", user);
    app.use("/api", transfer);

    app.post(
      "/api/login-user",
      async (err: any, req: Request, res: Response, next: NextFunction) => {
        passport.authenticate("local", (err: any, user: any, info: string) => {
          if (err)
            return res.status(404).json({ message: err.message, status: 404 });
          if (!user)
            return res.status(404).json({ message: info, status: 404 });

          return res.status(201).json({
            message: "Logged in successfully!",
            data: user,
            status: 201,
          });
        })(req, res, next);
      }
    );

    app.post(
      "/api/login",
      passport.authenticate("local", { failureRedirect: "/login" }),
      function (req: Request, res: Response, next: NextFunction) {
        res.status(200).json({
          message: "Logged in successfully!",
          data: req.user,
        });
      }
    );
  } catch (error) {
    return error;
  }
};
user;
