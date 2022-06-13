import express, { NextFunction, Request, Response, Router } from "express";
import UserRouter from "./routes/UserRouter";
import AuthRouter from "./routes/AuthRouter";
import DataSourceRouter from "./routes/DataSourceRouter";
import pool, { initTables } from "./database";
import cookieSession from "cookie-session";
import cors from "cors";

export class App {
  private app: express.Application;
  private api: Router;

  constructor() {
    this.app = express();
    this.api = Router();

    this.dbConfig();
    this.config();
    this.routes();
  }

  private config() {
    this.app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    this.app.set("trust proxy", true);
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(
      cookieSession({
        signed: false,
        secure: false,
      })
    );
  }

  private async dbConfig() {
    await initTables(pool);
  }

  private routes() {
    // Registering api router
    this.app.use("/api", this.api);

    // Register userRouter
    this.api.use("/user", UserRouter);
    this.api.use("/auth", AuthRouter);
    this.api.use("/datasource", DataSourceRouter);

    this.api.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log(err);
        return res
          .status(500)
          .json({ errors: [{ msg: "Internal server error" }] });
      }
    );
  }

  public start(port: number) {
    return new Promise<number>((resolve, reject) => {
      this.app
        .listen(port, () => {
          resolve(port);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}
