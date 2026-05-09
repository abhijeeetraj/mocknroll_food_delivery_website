import { Router } from "express";
import {
  createMenuItem,
  getMenuByPreference,
  getMenuByRestaurant,
  getMenuFilters
} from "../controllers/menuController.js";

const router = Router();

router.get("/restaurant/:restaurantId", getMenuByRestaurant);
router.get("/preference/:preference", getMenuByPreference);
router.get("/filters", getMenuFilters);
router.post("/", createMenuItem);

export default router;
