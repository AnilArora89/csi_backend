import exprees from "express";
import { listAgencies, createAgency, getSingleAgency, updateAgency, deleteAgency } from "./agencyController";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";
const agencyRouter = exprees.Router();

//installed multer for raw-data types input
//multer act as middleware
//multer used in routes

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 10 * 1024 * 1024 } //30 mb == 3e7 or 10mb =10 * 1024 * 1024
});


// agencyRouter.post("/register" ,() => {} ,createBook); - used for custom middlewares so that before request goes to controller it can be worked upon
agencyRouter.post("/", authenticate, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 }
]), createAgency);

agencyRouter.patch("/:agencyId", authenticate, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 }
]), updateAgency);


agencyRouter.get("/", listAgencies)

agencyRouter.get("/:agencyId", getSingleAgency);
agencyRouter.delete("/:agencyId", authenticate, deleteAgency);
export default agencyRouter;

//Working of Multer


/*Firstly multer creates a file in local machine then the file is sent to
  cloud storage then it gets deleted from the local machine
*/