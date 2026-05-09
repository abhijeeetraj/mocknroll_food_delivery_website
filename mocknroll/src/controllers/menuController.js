import { MenuItem } from "../models/MenuItem.js";

const parseList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string" || !value.trim()) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildMenuFilter = ({ restaurantId, preference, category, search, minPrice, maxPrice }) => {
  const filter = { isAvailable: true };

  if (restaurantId) {
    filter.restaurant = restaurantId;
  }

  if (preference) {
    filter.preference = preference;
  }

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $elemMatch: { $regex: search, $options: "i" } } }
    ];
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  return filter;
};

export const getMenuByRestaurant = async (req, res, next) => {
  try {
    const {
      preference,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "newest"
    } = req.query;

    const filter = buildMenuFilter({
      restaurantId: req.params.restaurantId,
      preference,
      category,
      search,
      minPrice,
      maxPrice
    });

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
      popular: { isPopular: -1, rating: -1 }
    };

    const menu = await MenuItem.find(filter).sort(sortMap[sortBy] || sortMap.newest);

    res.json(menu);
  } catch (error) {
    next(error);
  }
};

export const getMenuByPreference = async (req, res, next) => {
  try {
    const {
      restaurantId,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "popular"
    } = req.query;

    const filter = buildMenuFilter({
      restaurantId,
      preference: req.params.preference,
      category,
      search,
      minPrice,
      maxPrice
    });

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
      popular: { isPopular: -1, rating: -1 }
    };

    const items = await MenuItem.find(filter).sort(sortMap[sortBy] || sortMap.popular);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getMenuFilters = async (req, res, next) => {
  try {
    const { restaurantId, preference } = req.query;
    const filter = { isAvailable: true };

    if (restaurantId) filter.restaurant = restaurantId;
    if (preference) filter.preference = preference;

    const categories = await MenuItem.distinct("category", filter);
    const preferences = await MenuItem.distinct("preference", {
      ...filter,
      preference: { $exists: true }
    });
    const priceRange = await MenuItem.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ]);

    res.json({
      categories: categories.sort(),
      preferences: preferences.sort(),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 }
    });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const payload = req.body;
    const validPreferences = ["vegetarian", "non_vegetarian", "eggetarian"];

    if (!validPreferences.includes(payload.preference)) {
      return res.status(400).json({
        message: "preference must be one of vegetarian, non_vegetarian, eggetarian"
      });
    }

    payload.tags = parseList(payload.tags);
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};
