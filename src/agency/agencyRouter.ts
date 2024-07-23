import express from "express";
import { listAgencies, createAgency, getSingleAgency, updateAgency, deleteAgency, doneAgency, } from "./agencyController";
import multer from "multer";
import path from "node:path";
import Agency from './agencyModel'
import authenticate from "../middlewares/authenticate";
import restrict from "../middlewares/restrict";
import agencyModel from "./agencyModel";


const agencyRouter = express.Router();
const upload = multer();

//installed multer for raw-data types input
//multer act as middleware
//multer used in routes

// const upload = multer({
//   dest: path.resolve(__dirname, "../../public/data/uploads"),
//   limits: { fileSize: 10 * 1024 * 1024 } //30 mb == 3e7 or 10mb =10 * 1024 * 1024
// });

agencyRouter.post(
  "/",
  authenticate,
  restrict("admin"),
  upload.none(), // Only admin can create agencies
  createAgency
);

agencyRouter.patch(
  "/:_id",
  authenticate,
  restrict("admin"), // Only admin can update agencies
  updateAgency
);

agencyRouter.get(
  "/",
  authenticate,
  restrict("admin", "staff"), // Admin and staff can list agencies
  listAgencies
);

agencyRouter.get(
  "/:agencyId",
  authenticate,
  restrict("admin", "staff"), // Admin and staff can get a single agency
  getSingleAgency
);

agencyRouter.delete(
  "/:agencyId",
  authenticate,
  restrict("admin"), // Only admin can delete agencies
  deleteAgency
);

agencyRouter.put('/done/:agencyId', restrict("admin", "staff"), async (req, res) => {
  try {
    const { serviceReportNo, lastCalibrationDates, description } = req.body;
    const agency = await agencyModel.findById(req.params.agencyId);

    if (agency) {
      if (serviceReportNo) {
        agency.serviceReportNo = [...agency.serviceReportNo, ...serviceReportNo];
      }
      if (lastCalibrationDates) {
        agency.lastCalibrationDates = [
          ...agency.lastCalibrationDates,
          ...lastCalibrationDates,
        ];
      }
      if (description) {
        agency.description = description; // Update the description if provided
      }

      await agency.save();
      res.status(200).send(agency);
    } else {
      res.status(404).send({ message: 'Agency not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal server error', error });
  }
});


export default agencyRouter;

//Working of Multer


/*Firstly multer creat a file in local machine then the file is sent to
  cloud storage then it gets deleted from the local machine
*/


/*
// agencyRouter.post("/register" ,() => {} ,createBook); - used for custom middlewares so that before request goes to controller it can be worked upon
agencyRouter.post("/", authenticate, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "file", maxCount: 1 }
]), createAgency);

agencyRouter.patch("/:_id", authenticate, updateAgency);
// agencyRouter.put('/api/agency/:id', async (req, res) => {
//   const { id } = req.params;
//   const { serviceReports, calibrationDates } = req.body;

//   // Perform your update logic here
//   // Example:
//   try {
//     // Find and update the agency with the given ID
//     // Assuming you have a database function `updateAgencyById`
//     await updateAgencyById(id, { serviceReports, calibrationDates });
//     res.status(200).send({ message: 'Agency updated successfully' });
//   } catch (error) {
//     console.error("Error updating agency:", error);
//     res.status(500).send({ error: 'Error updating agency' });
//   }
// });
// upload.fields([
//   { name: "coverImage", maxCount: 1 },
//   { name: "file", maxCount: 1 }
// ]),

agencyRouter.get("/", listAgencies)

agencyRouter.get("/:agencyId", getSingleAgency);
agencyRouter.delete("/:agencyId", authenticate, deleteAgency);
*/