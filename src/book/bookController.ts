import { Response, Request, NextFunction } from "express";
import bookModel from './bookModel';
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs"
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";
import userModel from "../user/userModel";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, genre } = req.body;
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
        //creation of book in db

        const _req = req as AuthRequest

        const newBook = await bookModel.create({
            title,
            genre,
            author: _req.userId,
            coverImage: uploadResult.secure_url,
            file: bookFileUploadResult.secure_url
        })

        try {
            //delete the files in local folder
            await fs.promises.unlink(filepath);
            await fs.promises.unlink(Bookfilepath);
        } catch (err) {
            console.log(err);
            next(createHttpError(500, "Error while deleting"))
        }

        res.status(201).json({ id: newBook._id });
    } catch (err) {

        console.log(err);
        return next(createHttpError(500, "Error uploading file"))

    }




}

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const bookID = req.params.bookID;
    const { title, genre } = req.body;

    const book = await bookModel.findOne({ _id: bookID })

    if (!book) {
        return next(createHttpError(404, "No book found"));
    }

    //Now we are checking if the book getting updated is being done by the author itself or not
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
        return next(createHttpError(403, "Author mismatched"));
    }


    //updating cover image of book

    let completeCoverImage = "";
    const files = req.files as { [filename: string]: Express.Multer.File[] };
    if (files.coverImage) {
        const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        const filename = files.coverImage[0].filename;
        const filepath = path.resolve(__dirname, "../../public/data/uploads" + filename);
        completeCoverImage = filename;
        const uploadResult = await cloudinary.uploader.upload(filepath, {
            filename_override: completeCoverImage,
            folder: "book-covers",
            format: coverImageMimeType
        })

        completeCoverImage = uploadResult.secure_url;
        await fs.promises.unlink(filepath);
    }
    //updating book file

    let completeFileName = "";
    if (files.file) {
        const Bookfilename = files.file[0].filename;
        const Bookfilepath = path.resolve(__dirname, "../../public/data/uploads" + files.file[0].filename);
        completeFileName = Bookfilename

        const uploadBookPdf = await cloudinary.uploader.upload(Bookfilepath, {
            resource_type: "raw",
            filename_override: completeFileName,
            folder: 'book-pdfs',
            format: 'pdf',
        })

        completeFileName = uploadBookPdf.secure_url;
        await fs.promises.unlink(Bookfilepath);
    }
    //findOneandUpdate is used to find and then update
    // first param is used to find the book and second param is used to update the book if _id was found
    const updatedBook = await bookModel.findOneAndUpdate(
        {
            _id: bookID,
        },
        {
            title: title,
            genre: genre,
            coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
            file: completeFileName ? completeFileName : book.file
        }, {
        new: true
    }
    );

    res.json(updatedBook);
};

const ListBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //we will need to add pagination
        const book = await bookModel.find();
        res.json(book);
    }
    catch (err) {
        return next(createHttpError(500, "Error while getting books"));
    }
}

const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await bookModel.findOne({ _id: req.params.bookID });
        if (!book) return next(createHttpError(404, "Book not found"));

        res.json(book);

    } catch (err) {
        return next(createHttpError(500, "Error while getting the book"));
    }
}
export { createBook, updateBook, ListBook, getSingleBook }

/* Extra code for List Book pagination
const ListBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extracting page and limit from query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Options for pagination
        const options = {
            page,
            limit,
            populate: 'author' // Optionally populate the author field if needed
        };

        const result = await bookModel.paginate({}, options);

        // Sending paginated results along with metadata
        res.json({
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            totalBooks: result.totalDocs,
            books: result.docs,
        });
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, 'Error while getting books'));
    }
}

*/