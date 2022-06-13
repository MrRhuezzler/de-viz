import { JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";

export enum TokenTypes {
  ACCESS_TOKEN = "access-token",
  REFRESH_TOKEN = "refresh-token",
}

export const signAccessToken = async (email: string) => {
  return await signToken(email, TokenTypes.ACCESS_TOKEN);
};

export const signRefreshToken = async (email: string) => {
  return await signToken(email, TokenTypes.REFRESH_TOKEN);
};

const signToken = (email: string, type: TokenTypes) => {
  return new Promise<string>((resolve, reject) => {
    const payload = {};
    const options: SignOptions = {
      expiresIn: TokenTypes.ACCESS_TOKEN
        ? process.env.ACCESS_TOKEN_EXPIRES_IN
        : process.env.REFRESH_TOKEN_EXPIRES_IN,
      issuer: process.env.JWT_ISSUER,
      audience: email,
    };

    const secret = (
      type == TokenTypes.ACCESS_TOKEN
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET
    ) as string;

    sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      if (token) resolve(token);
    });
  });
};

export const verfiyAccessToken = async (token: string) => {
  return await verifyToken(token, TokenTypes.ACCESS_TOKEN);
};

export const verifyRefreshToken = async (token: string) => {
  return await verifyToken(token, TokenTypes.REFRESH_TOKEN);
};

const verifyToken = (token: string, type: TokenTypes) => {
  return new Promise<string | JwtPayload>((resolve, reject) => {
    const secret = (
      type == TokenTypes.ACCESS_TOKEN
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET
    ) as string;

    verify(token, secret, (err, payload) => {
      if (err) reject(err);
      if (payload) resolve(payload);
    });
  });
};
