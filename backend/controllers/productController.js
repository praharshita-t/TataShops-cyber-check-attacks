import {
  getAllProducts,
  getProductById as findProductById,
  searchProducts as queryProducts,
} from '../models/productModel.js';

export const getProducts = (req, res) => {
  try {
    const products = getAllProducts();
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products.',
    });
  }
};

export const getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = findProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product details.',
    });
  }
};

export const searchProducts = (req, res) => {
  try {
    const query = req.query.q || '';
    const products = queryProducts(query);

    return res.status(200).json({
      success: true,
      count: products.length,
      query,
      products,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search products.',
    });
  }
};
