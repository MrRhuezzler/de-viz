import { UserRepo } from "../database/repositories/UserRepo";
import pool from "../database";

export class UserController {

    private repo: UserRepo;

    constructor() {
        this.repo = new UserRepo(pool);
    }

};