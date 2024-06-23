import exprees from "express";
import { createBook } from "./bookController";
const bookRouter = exprees.Router();

bookRouter.post("/register" , createBook);

export default bookRouter;