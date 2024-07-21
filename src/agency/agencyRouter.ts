import exprees from "express";
import { listAgencies, createAgency, getSingleAgency, updateAgency, deleteAgency, } from "./agencyController";
import multer from "multer";
import path from "node:path";
import Agency from './agencyModel'
import authenticate from "../middlewares/authenticate";
import restrictTo from "../middlewares/restrict";

import agencyModel from './agencyModel';

const agencyRouter = exprees.Router();


//installed multer for raw-data types input
//multer act as middleware
//multer used in routes

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 10 * 1024 * 1024 } //30 mb == 3e7 or 10mb =10 * 1024 * 1024
});
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
agencyRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 }
  ]),
  //restrictTo(['admin']), // Only admin can create agencies
  createAgency
);

agencyRouter.patch(
  "/:_id",
  authenticate,
  //restrictTo(['admin']), // Only admin can update agencies
  updateAgency
);

agencyRouter.get(
  "/",
  authenticate,
  //restrictTo(['admin', 'staff']), // Admin and staff can list agencies
  listAgencies
);

agencyRouter.get(
  "/:agencyId",
  authenticate,
  //restrictTo(['admin', 'staff']), // Admin and staff can get a single agency
  getSingleAgency
);

agencyRouter.delete(
  "/:agencyId",
  authenticate,
  //restrictTo(['admin']), // Only admin can delete agencies
  deleteAgency
);

agencyRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { serviceReports, calibrationDates, description } = req.body;

  try {
    const updatedAgency = await agencyModel.findByIdAndUpdate(
      id,
      { serviceReports, calibrationDates, description },
      { new: true }
    );

    if (!updatedAgency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    res.json(updatedAgency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating agency' });
  }
});

export default agencyRouter;

//Working of Multer


/*Firstly multer creates a file in local machine then the file is sent to
  cloud storage then it gets deleted from the local machine
*/