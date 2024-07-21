import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    // Extracting fields from request body
    const { name, email, password, role } = req.body;

    // Step 1: Validation
    if (!name || !email || !password || !role) {
        const error = createHttpError(400, "ALL FIELDS REQUIRED");
        return next(error);
    }

    try {
        // Step 2: Logic
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            const error = createHttpError(400, "User already exists with this email");
            return next(error);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and store new user
        const newUser = await userModel.create({ name, email, password: hashedPassword });

        // Step 3: Token generation before sending response
        const token = sign({ sub: newUser._id }, config.jwtSecret as string, { expiresIn: "7d" });

        // Step 4: Response
        res.status(201).json({ accessToken: token });
    } catch (error) {
        // Handling any errors that occur during the process
        next(createHttpError(500, "Internal Server Error"));
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Step 1: Validation
    if (!email || !password) {
        return next(createHttpError(400, "All fields are required"));
    }

    try {
        // Step 2: Logic
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(createHttpError(404, "User not found"));
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return next(createHttpError(400, "Username or password mismatch"));
        }

        // Step 3: Token generation
        const token = sign({ sub: user._id }, config.jwtSecret as string, { expiresIn: "7d" });

        // Step 4: Response
        res.status(200).json({ accessToken: token });
    } catch (error) {
        // Handling any errors that occur during the process
        next(createHttpError(500, "Internal Server Error"));
    }
};

export { createUser, loginUser };
