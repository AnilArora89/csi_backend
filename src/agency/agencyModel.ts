import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import { Agency } from "./agencyTypes";

const agencySchema = new mongoose.Schema<Agency>(
    {
        routeNo: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        serviceReportNo: {
            type: [String], // Use String instead of string
            required: true,
        },
        person: {
            type: String,
            required: true,
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

agencySchema.plugin(mongoosePaginate);

export default mongoose.model<Agency>("Agency", agencySchema);
