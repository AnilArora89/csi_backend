import mongoose from "mongoose";
import { Agency } from "./agencyTypes";
import mongoosePaginate from 'mongoose-paginate-v2';

const agencySchema = new mongoose.Schema<Agency>(
    {
        routeNo: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            require: true,
        },
        person: {
            type: String,
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
        agencyNo: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
agencySchema.plugin(mongoosePaginate);

export default mongoose.model<Agency>("Agency", agencySchema);
