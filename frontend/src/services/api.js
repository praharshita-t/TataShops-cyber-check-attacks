/**
 * TataShops Frontend API Service
 * Connects frontend components and pages to the local Express backend on http://localhost:5000/api
 */

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `HTTP error! status: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

// ==========================================
// Authentication APIs
// ==========================================
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==========================================
// Product APIs
// ==========================================
export const productsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  search: async (query) => {
    const response = await fetch(
      `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return handleResponse(response);
  },
};

// ==========================================
// Cart APIs
// ==========================================
export const cartAPI = {
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse(response);
  },

  updateQuantity: async (productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },

  removeFromCart: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==========================================
// Order APIs
// ==========================================
export const ordersAPI = {
  createOrder: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getMyOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getOrderById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==========================================
// Profile / User APIs
// ==========================================
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },
};

// ==========================================
// Admin APIs
// ==========================================
export const adminAPI = {
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  user: userAPI,
  admin: adminAPI,
};
