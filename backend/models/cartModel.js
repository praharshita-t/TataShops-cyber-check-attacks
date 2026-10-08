import db from '../config/database.js';

export const getOrCreateCart = (userId) => {
  let cart = db.prepare('SELECT * FROM carts WHERE user_id = ?').get(userId);
  if (!cart) {
    const result = db.prepare('INSERT INTO carts (user_id) VALUES (?)').run(userId);
    cart = { id: result.lastInsertRowid, user_id: userId };
  }
  return cart;
};

export const getCartWithItems = (userId) => {
  const cart = getOrCreateCart(userId);
  const items = db
    .prepare(
      `
    SELECT 
      ci.id AS cart_item_id,
      ci.quantity,
      p.id,
      p.name,
      p.description,
      p.price,
      p.category,
      p.stock,
      p.image,
      p.rating
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = ?
    ORDER BY ci.id ASC
  `
    )
    .all(cart.id);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: cart.id,
    user_id: userId,
    items,
    total,
  };
};

export const addItemToCart = (userId, productId, quantity = 1) => {
  const cart = getOrCreateCart(userId);
  const existingItem = db
    .prepare('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?')
    .get(cart.id, productId);

  if (existingItem) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(
      quantity,
      existingItem.id
    );
  } else {
    db.prepare(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)'
    ).run(cart.id, productId, quantity);
  }

  // Update cart updated_at
  db.prepare('UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(cart.id);

  return getCartWithItems(userId);
};

export const updateCartItemQuantity = (userId, productId, quantity) => {
  const cart = getOrCreateCart(userId);
  if (quantity <= 0) {
    return removeCartItem(userId, productId);
  }

  db.prepare('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?').run(
    quantity,
    cart.id,
    productId
  );

  db.prepare('UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(cart.id);

  return getCartWithItems(userId);
};

export const removeCartItem = (userId, productId) => {
  const cart = getOrCreateCart(userId);
  db.prepare('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?').run(
    cart.id,
    productId
  );

  db.prepare('UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(cart.id);

  return getCartWithItems(userId);
};

export const clearCart = (userId) => {
  const cart = getOrCreateCart(userId);
  db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cart.id);
  db.prepare('UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(cart.id);
  return { id: cart.id, user_id: userId, items: [], total: 0 };
};
