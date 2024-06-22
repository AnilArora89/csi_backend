import { NextFunction , Request, Response } from "express";
import createHttpError from "http-errors";

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
    
    
    res.json({message:"MSG"});
}

export {createUser};