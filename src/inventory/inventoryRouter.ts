import express from "express";
const inventoryRouter = express.Router();
import { getInventory } from "./inventoryController";
inventoryRouter.get("/", getInventory);