import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../utils/validateEnv";

export const verifyedUser: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = req.headers["authorization"];
    if (!accessToken) {
      next(createHttpError(401, "Access denied. No access token provieded"));
    }
    jwt.verify(
      accessToken!.split("Bearer ")[1],
      env.JWT_TOKEN,
      (err, payload) => {
        if (err) {
          next(createHttpError(401, "Access denied. Token Expired"));
        } else {
          const userpayload = payload as JwtPayload;
          req.user = userpayload!.user;
          next();
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
