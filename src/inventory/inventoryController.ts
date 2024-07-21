import { Response, Request, NextFunction } from "express";
import inventoryModel from './inventoryModel';
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs"
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";
import userModel from "../user/userModel";

const getInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inventory = await inventoryModel.find();
        res.json(inventory);
    } catch (err) {
        return next(createHttpError(500, "Error while getting agencies"));
    }
};

export { getInventory };