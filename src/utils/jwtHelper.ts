import { JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";

export const signAccessToken = (email: string) => {

    return new Promise<string>((resolve, reject) => {

        const payload = {};
        const options: SignOptions = {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
            issuer: process.env.JWT_ISSUER,
            audience: email
        }

        const secret = process.env.ACCESS_TOKEN_SECRET as string;

        sign(payload, secret, options, (err, token) => {
            if (err) reject(err);
            if (token) resolve(token);
        });

    });

}

export const verfiyAccessToken = (token: string) => {

    return new Promise<string | JwtPayload>((resolve, reject) => {

        const secret = process.env.ACCESS_TOKEN_SECRET as string;

        verify(token, secret, (err, payload) => {
            if (err) reject(err);
            if (payload) resolve(payload);
        });

    });

}