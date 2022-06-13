import { NextFunction, Request, Response } from "express";
import pool from "../database";
import _ from "lodash";
import { QueryRepo } from "../database/repositories/QueryRepo";

export class QueryController {
  private queryRepo: QueryRepo;

  constructor() {
    this.queryRepo = new QueryRepo(pool);
  }
}
