import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    // Extracting fields from request body
    const { name, email, password } = req.body;

    // Step 1: Validation
    if (!name || !email || !password) {
        const error = createHttpError(400, "ALL FIELDS REQUIRED");
        return next(error);
    }

    try {
        // Step 2: Logic
        // Check if user already exists
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            const error = createHttpError(400, "User Already Exists with this email");
            return next(error);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and store new user
        const newUser = await userModel.create({ name, email, password: hashedPassword });


        //Step 2.1 Token generation before sending response
        const token = sign({sub: newUser._id},config.jwtSecret as string, {expiresIn: "7d",});
        //const token = sign({sub: newUser._id},config.jwtSecret as string, {expiresIn: "7d", algorithm: ''});



        // Step 3: Response
        res.status(201).json({ accessToken: token });
    } catch (error) {
        // Handling any errors that occur during the process
        next(createHttpError(500, "Internal Server Error"));
    }
};

const loginUser  = async (req:Request, res:Response, next:NextFunction) => {

};
export { createUser , loginUser};
