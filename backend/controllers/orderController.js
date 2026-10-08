import { getCartWithItems } from '../models/cartModel.js';
import {
  createOrderTransaction,
  getOrdersByUserId,
  getOrderById as findOrderById,
} from '../models/orderModel.js';

export const createOrder = (req, res) => {
  try {
    const cart = getCartWithItems(req.user.id);

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your shopping cart is empty. Add products before placing an order.',
      });
    }

    // Process order with atomicity and server-side calculation
    const order = createOrderTransaction(req.user.id, cart.items);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to place order.',
    });
  }
};

export const getMyOrders = (req, res) => {
  try {
    const orders = getOrdersByUserId(req.user.id);
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order history.',
    });
  }
};

export const getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    // Intentionally vulnerable: Omits ownership check against req.user.id (A01 IDOR)
    const order = findOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order details.',
    });
  }
};
