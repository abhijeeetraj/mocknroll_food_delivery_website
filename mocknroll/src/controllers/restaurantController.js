import { Restaurant } from "../models/Restaurant.js";

export const getRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, sortBy = "newest" } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { cuisine: { $elemMatch: { $regex: search, $options: "i" } } }
      ];
    }

    if (cuisine) {
      filter.cuisine = { $elemMatch: { $regex: `^${cuisine}$`, $options: "i" } };
    }

    const sortMap = {
      newest: { createdAt: -1 },
      rating_desc: { rating: -1 },
      delivery_fast: { deliveryTimeMinutes: 1 }
    };

    const restaurants = await Restaurant.find(filter).sort(
      sortMap[sortBy] || sortMap.newest
    );
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantFilters = async (req, res, next) => {
  try {
    const cuisines = await Restaurant.distinct("cuisine", { isActive: true });
    res.json({ cuisines: cuisines.sort() });
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
};
