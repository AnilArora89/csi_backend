import { Request, Response, NextFunction, RequestHandler } from "express";
import createHttpError from "http-errors";
import { AuthRequest } from "./authenticate"; // Adjust the path as necessary

const restrict = (...roles: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;

        console.log("User Role:", authReq.role);
        console.log("Allowed Roles:", roles);

        if (!roles.includes(authReq.role)) {
            const error = createHttpError(403, "You do not have permission to perform this action.");
            return next(error);
        }
        next();
    };
};

export default restrict;
