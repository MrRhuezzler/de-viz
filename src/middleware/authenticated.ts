import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import pool from "../database";
import { UserRepo } from "../database/repositories/UserRepo";
import { verfiyAccessToken } from "../utils/jwtHelper";

export const authorized = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const authorization = req.session;
        if (!authorization) return res.status(401).json({ 'message': 'Unauthorized' });

        const token = authorization.accessToken;
        const payload = await verfiyAccessToken(token) as JwtPayload;

        const email = payload.aud as string;
        const userRepo = new UserRepo(pool);
        const currentUser = await userRepo.getAUser(email);

        if (!currentUser) return res.status(401).json({ 'message': 'Unauthorized' });
        res.locals.currentUser = currentUser;

        next();

    } catch (err) {
        next(err);
    }
}
