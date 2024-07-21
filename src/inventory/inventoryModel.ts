import mongoose from "mongoose";
import { inventory } from "./inventoryTypes";
import mongoosePaginate from 'mongoose-paginate-v2';

const inventSchema = new mongoose.Schema<inventory>(
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
        lastCalibrationDates: {
            type: [Date],
            required: true,
        }
    },
    { timestamps: true }
);
inventSchema.plugin(mongoosePaginate);

export default mongoose.model<inventory>("Agency", inventSchema);
