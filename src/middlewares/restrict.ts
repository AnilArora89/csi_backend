import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
// Extend the default Express Request interface to include userId and userRole
export interface AuthRequest extends Request {
    userId: string;
    role: string;
}
const restrictTo = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest;
        if (!roles.includes(_req.role)) {
            return next(createHttpError(403, "You do not have permission to perform this action."));
        }
        next();
    }
}

export default restrictTo;
