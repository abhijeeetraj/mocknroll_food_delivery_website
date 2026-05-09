import { MenuItem } from "../models/MenuItem.js";
import { Order } from "../models/Order.js";

export const createOrder = async (req, res, next) => {
  try {
    const { restaurant, items, deliveryAddress, paymentMethod } = req.body;

    if (!restaurant || !items?.length || !deliveryAddress) {
      return res.status(400).json({
        message: "restaurant, items and deliveryAddress are required"
      });
    }

    const menuItems = await MenuItem.find({
      _id: { $in: items.map((i) => i.menuItem) }
    });

    const mappedItems = items.map((item) => {
      const dbItem = menuItems.find((m) => m._id.toString() === item.menuItem);
      if (!dbItem) throw new Error(`Invalid menu item: ${item.menuItem}`);
      return {
        menuItem: dbItem._id,
        name: dbItem.name,
        quantity: Number(item.quantity) || 1,
        price: dbItem.price
      };
    });

    const totalAmount = mappedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      restaurant,
      items: mappedItems,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || "cod"
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};
