import { Router } from "express";
import {
  createRestaurant,
  getRestaurantFilters,
  getRestaurants
} from "../controllers/restaurantController.js";

const router = Router();

router.get("/", getRestaurants);
router.get("/filters", getRestaurantFilters);
router.post("/", createRestaurant);

export default router;
