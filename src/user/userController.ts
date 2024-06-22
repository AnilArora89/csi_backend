import { NextFunction , Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";

const createUser = async (req : Request,res : Response , next : NextFunction) => {
    //when request comes follow few steps:
    //1. Validation
    //2. Logic
    //3. Response

    const {name, email, password} = req.body;
    if(!name || !email || !password){
        const error = createHttpError(400, "ALL FIELDS REQUIRED")
        return next(error);

        // or we could have just returned return res.json({message:INVALID});
    }
    
    //now we will check whether the user trying to registered is already registerd or not?
    //database call
    
    const user = await userModel.findOne({email: email});
    if(user){
        const error = createHttpError(400,"User Already Exists with this email");
        return next(error);
    }

    



    res.json({message:"MSG"});
}

export {createUser};