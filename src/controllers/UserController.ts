import { UserRepo } from "../database/repositories/UserRepo";
import pool from "../database";
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from "express";

export class UserController {

    private repo: UserRepo;

    constructor() {
        this.repo = new UserRepo(pool);
    }

    private async hashPassword(password: string) {

        try {

            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);

        } catch (err) {
            throw err;
        }

    }

    public async post(req: Request, res: Response, next: NextFunction) { }

};