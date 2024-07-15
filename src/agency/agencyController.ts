import { Response, Request, NextFunction } from "express";
import agencyModel from './agencyModel';
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs"
import createHttpError from "http-errors";
import { AuthRequest } from "../middlewares/authenticate";
import userModel from "../user/userModel";

const createAgency = async (req: Request, res: Response, next: NextFunction) => {
    const { routeNo, agencyNo, description } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
    );

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "agency-covers",
            format: coverImageMimeType,
        });

        const agencyFileName = files.file[0].filename;
        const agencyFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            agencyFileName
        );

        const agencyFileUploadResult = await cloudinary.uploader.upload(
            agencyFilePath,
            {
                resource_type: "raw",
                filename_override: agencyFileName,
                folder: "agency-pdfs",
                format: "pdf",
            }
        );

        const _req = req as AuthRequest;

        const newAgency = await agencyModel.create({
            routeNo,
            description,
            agencyNo,
            person: _req.userId,
            coverImage: uploadResult.secure_url,
            file: agencyFileUploadResult.secure_url,
        });

        // Delete temp files
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(agencyFilePath);

        res.status(201).json({ id: newAgency._id });
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, "Error while uploading the files."));
    }
};

const updateAgency = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const agencyId = req.params.agencyId;
        const { routeNo, agencyNo } = req.body;

        const agency = await agencyModel.findOne({ _id: agencyId });

        if (!agency) {
            return next(createHttpError(404, "No agency found"));
        }

        const _req = req as AuthRequest;
        if (agency.person.toString() !== _req.userId) {
            return next(createHttpError(403, "Author mismatched"));
        }

        let completeCoverImage = "";
        const files = req.files as { [filename: string]: Express.Multer.File[] };
        if (files.coverImage) {
            const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
            const filename = files.coverImage[0].filename;
            const filepath = path.resolve(__dirname, "../../public/data/uploads/" + filename);
            completeCoverImage = filename;
            const uploadResult = await cloudinary.uploader.upload(filepath, {
                filename_override: completeCoverImage,
                folder: "agency-covers",
                format: coverImageMimeType
            })

            completeCoverImage = uploadResult.secure_url;
            await fs.promises.unlink(filepath);
        }

        let completeFileName = "";
        if (files.file) {
            const agencyFileName = files.file[0].filename;
            const agencyFilePath = path.resolve(__dirname, "../../public/data/uploads/" + files.file[0].filename);
            completeFileName = agencyFileName

            const uploadAgencyPdf = await cloudinary.uploader.upload(agencyFilePath, {
                resource_type: "raw",
                filename_override: completeFileName,
                folder: 'agency-pdfs',
                format: 'pdf',
            })

            completeFileName = uploadAgencyPdf.secure_url;
            await fs.promises.unlink(agencyFilePath);
        }

        const updatedAgency = await agencyModel.findOneAndUpdate(
            {
                _id: agencyId,
            },
            {
                routeNo: routeNo,
                agencyNo: agencyNo,
                coverImage: completeCoverImage ? completeCoverImage : agency.coverImage,
                file: completeFileName ? completeFileName : agency.file
            },
            {
                new: true
            }
        );

        res.json(updatedAgency);
    } catch (err) {
        console.log(err, " error while updating agency");
        next(createHttpError(400, "Error updating agency"));
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

        const coverFileSplits = agency.coverImage.split("/");
        const coverImagePublicId =
            coverFileSplits.at(-2) +
            "/" +
            coverFileSplits.at(-1)?.split(".").at(-2);

        const agencyFileSplits = agency.file.split("/");
        const agencyFilePublicId =
            agencyFileSplits.at(-2) + "/" + agencyFileSplits.at(-1);

        await cloudinary.uploader.destroy(coverImagePublicId);
        await cloudinary.uploader.destroy(agencyFilePublicId, {
            resource_type: "raw",
        });

        await agencyModel.deleteOne({ _id: req.params.agencyId });

        return res.sendStatus(204);

    } catch (err) {
        return next(createHttpError(500, "Error while deleting the agency"));
    }
};

export { createAgency, updateAgency, listAgencies, getSingleAgency, deleteAgency };

// import { Response, Request, NextFunction } from "express";
// import bookModel from './bookModel';
// import cloudinary from "../config/cloudinary";
// import path from "node:path";
// import fs from "node:fs"
// import createHttpError from "http-errors";
// import { AuthRequest } from "../middlewares/authenticate";
// import userModel from "../user/userModel";

// const createBook = async (req: Request, res: Response, next: NextFunction) => {
//     const { title, genre, description } = req.body;

//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//     // 'application/pdf'
//     const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
//     const fileName = files.coverImage[0].filename;
//     const filePath = path.resolve(
//         __dirname,
//         "../../public/data/uploads",
//         fileName
//     );

//     try {
//         const uploadResult = await cloudinary.uploader.upload(filePath, {
//             filename_override: fileName,
//             folder: "book-covers",
//             format: coverImageMimeType,
//         });

//         const bookFileName = files.file[0].filename;
//         const bookFilePath = path.resolve(
//             __dirname,
//             "../../public/data/uploads",
//             bookFileName
//         );

//         const bookFileUploadResult = await cloudinary.uploader.upload(
//             bookFilePath,
//             {
//                 resource_type: "raw",
//                 filename_override: bookFileName,
//                 folder: "book-pdfs",
//                 format: "pdf",
//             }
//         );
//         const _req = req as AuthRequest;

//         const newBook = await bookModel.create({
//             title,
//             description,
//             genre,
//             author: _req.userId,
//             coverImage: uploadResult.secure_url,
//             file: bookFileUploadResult.secure_url,
//         });

//         // Delete temp.files
//         // todo: wrap in try catch...
//         await fs.promises.unlink(filePath);
//         await fs.promises.unlink(bookFilePath);

//         res.status(201).json({ id: newBook._id });
//     } catch (err) {
//         console.log(err);
//         return next(createHttpError(500, "Error while uploading the files."));
//     }
// };

// /*
// //helper function to delete prev cover image while uploading new cover image
// function getCloudinaryPublicId(url: string): string {
//     const parts = url.split('/');
//     const fileName = parts[parts.length - 1];
//     const folderPath = parts.slice(-2, -1)[0];
//     const publicId = `${folderPath}/${fileName.split('.')[0]}`;
//     return publicId;
// }
//     */


// const updateBook = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const bookID = req.params.bookID;
//         const { title, genre } = req.body;

//         const book = await bookModel.findOne({ _id: bookID })

//         if (!book) {
//             return next(createHttpError(404, "No book found"));
//         }

//         //Now we are checking if the book getting updated is being done by the author itself or not
//         const _req = req as AuthRequest;
//         if (book.author.toString() !== _req.userId) {
//             return next(createHttpError(403, "Author mismatched"));
//         }


//         //updating cover image of book

//         let completeCoverImage = "";
//         const files = req.files as { [filename: string]: Express.Multer.File[] };
//         if (files.coverImage) {
//             /*const previousCoverImagePublicId = getCloudinaryPublicId(book.coverImage);
//             // Delete the previous cover image
//             await cloudinary.uploader.destroy(previousCoverImagePublicId);*/

//             const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
//             const filename = files.coverImage[0].filename;
//             const filepath = path.resolve(__dirname, "../../public/data/uploads/" + filename);
//             completeCoverImage = filename;
//             const uploadResult = await cloudinary.uploader.upload(filepath, {
//                 filename_override: completeCoverImage,
//                 folder: "book-covers",
//                 format: coverImageMimeType
//             })

//             completeCoverImage = uploadResult.secure_url;
//             await fs.promises.unlink(filepath);
//         }
//         //updating book file

//         let completeFileName = "";
//         if (files.file) {
//             const Bookfilename = files.file[0].filename;
//             const Bookfilepath = path.resolve(__dirname, "../../public/data/uploads/" + files.file[0].filename);
//             completeFileName = Bookfilename

//             const uploadBookPdf = await cloudinary.uploader.upload(Bookfilepath, {
//                 resource_type: "raw",
//                 filename_override: completeFileName,
//                 folder: 'book-pdfs',
//                 format: 'pdf',
//             })

//             completeFileName = uploadBookPdf.secure_url;
//             await fs.promises.unlink(Bookfilepath);
//         }
//         //findOneandUpdate is used to find and then update
//         // first param is used to find the book and second param is used to update the book if _id was found
//         const updatedBook = await bookModel.findOneAndUpdate(
//             {
//                 _id: bookID,
//             },
//             {
//                 title: title,
//                 genre: genre,
//                 coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
//                 file: completeFileName ? completeFileName : book.file
//             }, {
//             new: true
//         }
//         );

//         res.json(updatedBook);
//     } catch (err) {
//         console.log(err, " error while updating book");
//         next(createHttpError(400, "Error updating book"));
//     }
// };

// const ListBook = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         //we will need to add pagination
//         const book = await bookModel.find();
//         res.json(book);
//     }
//     catch (err) {
//         return next(createHttpError(500, "Error while getting books"));
//     }
// }

// const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const book = await bookModel.findOne({ _id: req.params.bookID });
//         if (!book) return next(createHttpError(404, "Book not found"));

//         res.json(book);

//     } catch (err) {
//         return next(createHttpError(500, "Error while getting the book"));
//     }
// }
// const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const book = await bookModel.findOne({ _id: req.params.bookID });
//         if (!book) return next(createHttpError(404, "Book not found that is to be deleted"));

//         //checking if its done by the authorised user or not
//         const _req = req as AuthRequest;
//         if (book.author.toString() !== _req.userId) {
//             return next(createHttpError(403, "Author mismatched"));
//         }
//         //after authenticating,delete the book from cloud storage
//         const coverFileSplits = book.coverImage.split("/");
//         const coverImagePublicId =
//             coverFileSplits.at(-2) +
//             "/" +
//             coverFileSplits.at(-1)?.split(".").at(-2);

//         const bookFileSplits = book.file.split("/");
//         const bookFilePublicId =
//             bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);
//         console.log("bookFilePublicId", bookFilePublicId);
//         // todo: add try error block
//         await cloudinary.uploader.destroy(coverImagePublicId);
//         await cloudinary.uploader.destroy(bookFilePublicId, {
//             resource_type: "raw",
//         });

//         await bookModel.deleteOne({ _id: req.params.bookID });

//         return res.sendStatus(204);

//     } catch (err) { return next(createHttpError(500, "Error while deleting the book")) }
// }
// export { createBook, updateBook, ListBook, getSingleBook, deleteBook }

// /* Extra code for List Book pagination
// const ListBook = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // Extracting page and limit from query parameters
//         const page = parseInt(req.query.page as string) || 1;
//         const limit = parseInt(req.query.limit as string) || 10;

//         // Options for pagination
//         const options = {
//             page,
//             limit,
//             populate: 'author' // Optionally populate the author field if needed
//         };

//         const result = await bookModel.paginate({}, options);

//         // Sending paginated results along with metadata
//         res.json({
//             page: result.page,
//             limit: result.limit,
//             totalPages: result.totalPages,
//             totalBooks: result.totalDocs,
//             books: result.docs,
//         });
//     } catch (err) {
//         console.log(err);
//         return next(createHttpError(500, 'Error while getting books'));
//     }
// }

// */