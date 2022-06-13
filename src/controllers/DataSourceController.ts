import { NextFunction, Request, Response } from "express";
import pool from "../database";
import { DataSourceRepo } from "../database/repositories/DataSourceRepo";

export class DataSourceController {
  private dsRepo: DataSourceRepo;

  constructor() {
    this.dsRepo = new DataSourceRepo(pool);
  }

  public queries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.currentUser;
      const ds = await this.dsRepo.getAllDataSourcesOfAUser(user.email);
      return res.status(200).json({ message: "Success", data: ds });
    } catch (err) {
      next(err);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, type, db_host, db_port, db_name, db_user, db_password } =
        req.body;
      const user = res.locals.currentUser;
      const ds = await this.dsRepo.insertDataSource(
        name,
        type,
        db_host,
        db_port,
        db_name,
        db_user,
        db_password,
        user.email
      );
      return res.status(200).json({ message: "Success", data: ds });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, type, db_host, db_port, db_name, db_user, db_password } =
        req.body;

      const { id } = req.params;
      const user = res.locals.currentUser;

      // Check existence and authorization
      const datasrc = await this.dsRepo.getADataSource(id);
      if (datasrc) {
        if (datasrc.useremail !== user.email) {
          return res.status(404).json({ message: "Not found" });
        }
      } else {
        return res.status(404).json({ message: "Not found" });
      }

      const ds = await this.dsRepo.updateDataSource(
        id,
        name,
        type,
        db_host,
        db_port,
        db_name,
        db_user,
        db_password
      );

      return res.status(200).json({ message: "Success", data: ds });
    } catch (err) {
      next(err);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = res.locals.currentUser;

      // Check existence and authorization
      const datasrc = await this.dsRepo.getADataSource(id);
      if (datasrc) {
        if (datasrc.useremail !== user.email) {
          return res.status(404).json({ message: "Not found" });
        }
      } else {
        return res.status(404).json({ message: "Not found" });
      }

      await this.dsRepo.deleteDataSource(id);
      return res.status(200).json({ message: "Success" });
    } catch (err) {
      next(err);
    }
  };
}
