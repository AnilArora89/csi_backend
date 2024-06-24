import exprees from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";
const bookRouter = exprees.Router();

//installed multer for raw-data types input
//multer act as middleware
//multer used in routes

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 10 * 1024 * 1024 } //30 mb == 3e7 or 10mb =10 * 1024 * 1024
});


// bookRouter.post("/register" ,() => {} ,createBook); - used for custom middlewares so that before request goes to controller it can be worked upon
bookRouter.post("/register", authenticate, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 }
]), createBook);

export default bookRouter;

//Working of Multer


/*Firstly multer creates a file in local machine then the file is sent to
  cloud storage then it gets deleted from the local machine
*/