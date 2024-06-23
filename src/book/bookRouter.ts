import exprees from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";
const bookRouter = exprees.Router();


const upload = multer({
    dest: path.resolve(__dirname, "../../public/data/uploads"),
    limits: {fileSize: 3e7} //30 mb == 3e7
});


// bookRouter.post("/register" ,() => {} ,createBook); - used for custom middlewares so that before request goes to controller it can be worked upon
bookRouter.post("/register", upload.fields([
    {name: "coverImage", maxCount: 1},
    {name: "file", maxCount: 1}
]) , createBook);

export default bookRouter;

//Working of Multer


/*Firstly multer creates a file in local machine then the file is sent to
  cloud storage then it gets deleted from the local machine
*/