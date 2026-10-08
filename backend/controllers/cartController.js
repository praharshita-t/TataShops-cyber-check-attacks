import {
  getCartWithItems,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
} from '../models/cartModel.js';
import { getProductById } from '../models/productModel.js';

export const getCart = (req, res) => {
  try {
    const cart = getCartWithItems(req.user.id);
    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve shopping cart.',
    });
  }
};

export const addToCart = (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required.',
      });
    }

    const product = getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number.',
      });
    }

    const cart = addItemToCart(req.user.id, productId, qty);

    return res.status(200).json({
      success: true,
      message: 'Product added to cart.',
      cart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add item to cart.',
    });
  }
};

export const updateQuantity = (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required.',
      });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity provided.',
      });
    }

    const cart = updateCartItemQuantity(req.user.id, productId, qty);

    return res.status(200).json({
      success: true,
      message: 'Cart item quantity updated.',
      cart,
    });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update cart item quantity.',
    });
  }
};

export const removeFromCart = (req, res) => {
  try {
    const { productId } = req.params;
    const cart = removeCartItem(req.user.id, productId);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
      cart,
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart.',
    });
  }
};
