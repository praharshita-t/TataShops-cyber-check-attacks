import { getAllUsers } from '../models/userModel.js';
import {
  getAllProducts,
  getProductById,
  createProduct as addProduct,
  updateProduct as editProduct,
  deleteProduct as removeProduct,
} from '../models/productModel.js';

export const getUsers = (req, res) => {
  try {
    const users = getAllUsers();
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Admin error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users.',
    });
  }
};

export const getProducts = (req, res) => {
  try {
    const products = getAllProducts();
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Admin error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products.',
    });
  }
};

export const createProduct = (req, res) => {
  try {
    const { name, description = '', price, category, stock = 0, image = '', rating = 0 } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required fields.',
      });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid non-negative number.',
      });
    }

    const newProduct = addProduct({
      name: name.trim(),
      description: description.trim(),
      price: numPrice,
      category: category.trim(),
      stock: Number(stock) || 0,
      image: image.trim() || '/images/accessory-1.svg',
      rating: Number(rating) || 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product: newProduct,
    });
  } catch (error) {
    console.error('Admin error creating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product.',
    });
  }
};

export const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const existing = getProductById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const updated = editProduct(id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updated,
    });
  } catch (error) {
    console.error('Admin error updating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product.',
    });
  }
};

export const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const existing = getProductById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    removeProduct(id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    console.error('Admin error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product.',
    });
  }
};
