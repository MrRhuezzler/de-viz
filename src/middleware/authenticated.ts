import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import pool from "../database";
import { UserRepo } from "../database/repositories/UserRepo";
import {
  TokenTypes,
  verfiyAccessToken,
  verifyRefreshToken,
} from "../utils/jwtHelper";

export const authorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.session;
    if (!authorization)
      return res.status(401).json({ message: "Unauthorized" });
    const token = authorization.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const currentUser = await authorize(token, TokenTypes.ACCESS_TOKEN);
    if (!currentUser) return res.status(401).json({ message: "Unauthorized" });
    res.locals.currentUser = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

export const authorizedRefresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const currentUser = await authorize(token, TokenTypes.REFRESH_TOKEN);
    if (!currentUser) return res.status(401).json({ message: "Unauthorized" });
    res.locals.currentUser = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

const authorize = async (token: string, type: TokenTypes) => {
  try {
    const payload = (
      type == TokenTypes.ACCESS_TOKEN
        ? await verfiyAccessToken(token)
        : await verifyRefreshToken(token)
    ) as JwtPayload;

    const email = payload.aud as string;
    const userRepo = new UserRepo(pool);
    return await userRepo.getAUser(email);
  } catch (err) {
    throw err;
  }
};
