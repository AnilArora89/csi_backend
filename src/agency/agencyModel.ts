import mongoose from "mongoose";
import { Agency } from "./agencyTypes";
import mongoosePaginate from 'mongoose-paginate-v2';

const agencySchema = new mongoose.Schema<Agency>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            require: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            // add ref
            ref: "User",
            required: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        file: {
            type: String,
            requied: true,
        },
        genre: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
agencySchema.plugin(mongoosePaginate);

export default mongoose.model<Agency>("Agency", agencySchema);
