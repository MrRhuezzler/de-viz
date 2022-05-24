import { NextFunction, Request, Response } from "express";
import pool from "../database";
import { UserRepo } from "../database/repositories/UserRepo";
import bcrypt from 'bcryptjs';
import { signAccessToken } from "../utils/jwtHelper";
import _ from 'lodash';

export class AuthController {

    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo(pool);
        // this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.currentUser = this.currentUser.bind(this);
    }

    private createPasswordHash = async (password: string) => {

        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, 10);
        } catch (err) {
            throw err;
        }

    }

    public register = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const { name, email, password } = req.body;

            const user = await this.userRepo.getAUser(email);
            if (user) return res.status(400).json({ 'message': 'User already exists' });

            const hashedPassword = await this.createPasswordHash(password);
            await this.userRepo.insertUser(email, name, hashedPassword);

            return res.status(201).json({ 'message': 'User created successfully' });

        } catch (err) {
            next(err);
        }

    }

    public login = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const { email, password } = req.body;
            const user = await this.userRepo.getAUser(email);
            if (!user) res.status(400).json({ 'message': 'Not a matching pair of credentials' });

            const { password: hashedPassword } = user;
            const isPasswordValid = await bcrypt.compare(password, hashedPassword);

            if (isPasswordValid) {

                const token = await signAccessToken(user.email);
                req.session = { accessToken: token };

                return res.status(200).json({ 'message': 'Login successful' });

            } else {
                return res.status(400).json({ 'message': 'Not a matching pair of credentials' });
            }

        } catch (err) {
            next(err);
        }

    }

    public currentUser = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const user = res.locals.currentUser;
            return res.status(200).json({ 'message': 'User found', 'user': _.omit(user, 'password') });
        } catch (err) {
            next(err);
        }

    }

}