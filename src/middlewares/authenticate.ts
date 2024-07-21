import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify, JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";
// Extend the default Express Request interface to include userId and userRole
export interface AuthRequest extends Request {
  userId: string;
  role: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Authorization token is required."));
  }

  try {
    const parsedToken = token.split(" ")[1];
    const decoded = verify(parsedToken, config.jwtSecret as string) as JwtPayload;;
    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;
    _req.role = decoded.role as string;

    next();
  } catch (err) {
    return next(createHttpError(401, "Token expired."));
  }
};



export default authenticate;
