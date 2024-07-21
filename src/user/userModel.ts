import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, //email di jgah route name krdange
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'staff'], // enum restricts role to either 'admin' or 'staff'
        required: true,
        default: 'staff'
    }
}, { timestamps: true });

//timestamps used to get info when was the thing last created or updated


export default mongoose.model<User>('User', userSchema);