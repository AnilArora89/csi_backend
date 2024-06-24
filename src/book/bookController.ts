import { Response, Request, NextFunction } from "express";
import bookModel from './bookModel';
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("files", req.files);
        const files = req.files as { [filename: string]: Express.Multer.File[] };
        const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        const filename = files.coverImage[0].filename;
        const filepath = path.resolve(__dirname, "../../public/data/uploads", filename);

        const uploadResult = await cloudinary.uploader.upload(filepath, {
            filename_override: filename,
            folder: "book-covers",
            format: coverImageMimeType,  //here can directly write jpg just for info we wrote mimetype 
        })

        const Bookfilename = files.file[0].filename;
        const Bookfilepath = path.resolve(__dirname, "../../public/data/uploads", Bookfilename);

        const bookFileUploadResult = await cloudinary.uploader.upload(Bookfilepath, {
            resource_type: "raw",
            filename_override: Bookfilename,
            folder: 'book-pdfs',
            format: "pdf",
        })

        console.log("COVER UPLOAD RESULT", uploadResult)
        console.log("BOOKFILE UPLOAD RESULT", bookFileUploadResult)
        res.json({});
    } catch (err) {

        console.log(err);
        return next(createHttpError(500, "Error uploading file"))

    }




}

export { createBook }; 