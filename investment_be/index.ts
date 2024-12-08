import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConfig } from "./utils/dbConfig";
import { mainApp } from "./mainApp";
import session from "express-session";
dotenv.config();

const app: Application = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173/");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(
  cors({
    origin: ["http://localhost:5174"],
  })
);
app.use(express.json());

app.set("trust proxy", 1);
app.use(
  session({
    secret: "just-build",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600 },
  })
);

const port = parseInt(process.env.PORT as string);

mainApp(app);

app.listen(port, () => {
  console.log("read");
  dbConfig();
});
