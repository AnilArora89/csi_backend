import { Response, Request, NextFunction } from "express";
import agencyModel from './agencyModel';
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";
// import userModel from "../user/userModel"; // Uncomment if needed

const createAgency = async (req: Request, res: Response, next: NextFunction) => {
    const { routeNo, agencyNo, description, lastCalibrationDates, person, serviceReportNo } = req.body;
    // Parse lastCalibrationDates and serviceReportNo
    if (!routeNo || !agencyNo || !description || !person) {
        return next(createHttpError(400, "Missing required fields."));
    }

    let lastcalibdates = [];
    let serviceReportNumbers = [];

    try {
        lastcalibdates = JSON.parse(lastCalibrationDates || "[]");
        serviceReportNumbers = JSON.parse(serviceReportNo || "[]");
    } catch (error) {
        console.error("Parsing Error:", error);
        return next(createHttpError(400, "Invalid JSON format in request body."));
    }


    try {
        // const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        // const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        // const fileName = files.coverImage[0].filename;
        // const filePath = path.resolve(
        //     __dirname,
        //     "../../public/data/uploads",
        //     fileName
        // );

        // const uploadResult = await cloudinary.uploader.upload(filePath, {
        //     filename_override: fileName,
        //     folder: "agency-covers",
        //     format: coverImageMimeType,
        // });

        // const agencyFileName = files.file[0].filename;
        // const agencyFilePath = path.resolve(
        //     __dirname,
        //     "../../public/data/uploads/",
        //     agencyFileName
        // );

        // const agencyFileUploadResult = await cloudinary.uploader.upload(
        //     agencyFilePath,
        //     {
        //         resource_type: "raw",
        //         filename_override: agencyFileName,
        //         folder: "agency-pdfs",
        //         format: "pdf",
        //     }
        // );

        const _req = req as AuthRequest;

        const newAgency = await agencyModel.create({
            person,
            routeNo,
            description,
            agencyNo,
            serviceReportNo: serviceReportNumbers, // Use the parsed serviceReportNo
            // coverImage: uploadResult.secure_url,
            // file: agencyFileUploadResult.secure_url,
            lastCalibrationDates: lastcalibdates.map((dateString: string) => new Date(dateString)),
        });

        // Delete temp files
        // await fs.promises.unlink(filePath);
        // await fs.promises.unlink(agencyFilePath);

        res.status(201).json(newAgency);
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, "Error while creating the agency."));
    }
};


const updateAgency = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const agencyId = req.params._id;
        const { routeNo, agencyNo, person, description, lastCalibrationDates, serviceReportNo } = req.body;

        // Parse serviceReportNo if it's a JSON string
        const serviceReportNumbers = serviceReportNo ? serviceReportNo : [];

        const agency = await agencyModel.findOne({ _id: agencyId });

        if (!agency) {
            return next(createHttpError(404, "No agency found"));
        }

        // Validate lastCalibrationDates
        let parsedLastCalibrationDates: Date[] = [];
        if (lastCalibrationDates) {
            if (!Array.isArray(lastCalibrationDates)) {
                return next(createHttpError(400, "Invalid lastCalibrationDates format"));
            }
            // Convert strings to Date objects if necessary
            parsedLastCalibrationDates = lastCalibrationDates.map((date: string | Date) => new Date(date));
        }

        const updatedAgency = await agencyModel.findOneAndUpdate(
            { _id: agencyId },
            {
                routeNo,
                agencyNo,
                person,
                description,
                lastCalibrationDates: parsedLastCalibrationDates,
                serviceReportNo: serviceReportNumbers // Use the parsed serviceReportNo
            },
            { new: true }
        );

        res.json(updatedAgency);
    } catch (err) {
        console.log(err, " error while updating agency");
        next(createHttpError(500, "Error updating agency"));
    }
};


const listAgencies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const agencies = await agencyModel.find();
        res.json(agencies);
    } catch (err) {
        return next(createHttpError(500, "Error while getting agencies"));
    }
};

const getSingleAgency = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const agency = await agencyModel.findOne({ _id: req.params.agencyId });
        if (!agency) return next(createHttpError(404, "Agency not found"));

        res.json(agency);

    } catch (err) {
        return next(createHttpError(500, "Error while getting the agency"));
    }
};

const deleteAgency = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const agency = await agencyModel.findOne({ _id: req.params.agencyId });
        if (!agency) return next(createHttpError(404, "Agency not found"));

        const _req = req as AuthRequest;
        // if (agency.author.toString() !== _req.userId) {
        //     return next(createHttpError(403, "Author mismatched"));
        // }

        // const coverFileSplits = agency.coverImage.split("/");
        // const coverImagePublicId =
        //     coverFileSplits.at(-2) +
        //     "/" +
        //     coverFileSplits.at(-1)?.split(".").at(-2);

        // const agencyFileSplits = agency.file.split("/");
        // const agencyFilePublicId =
        //     agencyFileSplits.at(-2) + "/" + agencyFileSplits.at(-1);

        // await cloudinary.uploader.destroy(coverImagePublicId);
        // await cloudinary.uploader.destroy(agencyFilePublicId, {
        //     resource_type: "raw",
        // });

        await agencyModel.deleteOne({ _id: req.params.agencyId });

        return res.sendStatus(204);

    } catch (err) {
        return next(createHttpError(500, "Error while deleting the agency"));
    }
};

interface UpdateRequestBody {
    lastCalibrationDates: string[]; // or Date[] if sending Date objects directly
}

const doneAgency = async (req: Request, res: Response) => {

    const doneAgency = async (req: Request, res: Response) => {
        try {
            const { serviceReports, calibrationDates, description } = req.body;
            const agencyId = req.params.agencyId;



            const agency = await agencyModel.findById(agencyId);

            if (agency) {
                agency.serviceReportNo.push(...serviceReports);
                agency.lastCalibrationDates.push(...calibrationDates);
                agency.description = description;

                await agency.save();

                res.status(200).send(agency);
            } else {
                res.status(404).send({ message: 'Agency not found' });
            }
        } catch (error) {
            console.error('Error updating agency:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    };

};



export { createAgency, updateAgency, doneAgency, listAgencies, getSingleAgency, deleteAgency };
