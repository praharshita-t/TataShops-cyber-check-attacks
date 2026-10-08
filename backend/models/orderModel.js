import db from '../config/database.js';

export const createOrderTransaction = (userId, cartItems) => {
  // Use a transaction to ensure atomicity
  const insertOrderStmt = db.prepare(`
    INSERT INTO orders (user_id, total_amount, status)
    VALUES (?, ?, 'Processing')
  `);

  const insertOrderItemStmt = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
    VALUES (?, ?, ?, ?, ?)
  `);

  const clearCartItemsStmt = db.prepare(`
    DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)
  `);

  const transaction = db.transaction(() => {
    // 1. Calculate actual total from database
    let totalAmount = 0;
    const itemsToInsert = [];

    for (const item of cartItems) {
      const product = db.prepare('SELECT id, name, price, stock FROM products WHERE id = ?').get(item.id || item.product_id);
      if (!product) {
        throw new Error(`Product ${item.name || item.product_id} no longer exists`);
      }
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      itemsToInsert.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // 2. Insert order
    const orderResult = insertOrderStmt.run(userId, totalAmount);
    const orderId = orderResult.lastInsertRowid;

    // 3. Insert order items
    for (const itm of itemsToInsert) {
      insertOrderItemStmt.run(orderId, itm.productId, itm.name, itm.price, itm.quantity);
    }

    // 4. Clear cart
    clearCartItemsStmt.run(userId);

    return orderId;
  });

  const orderId = transaction();
  return getOrderById(orderId, userId);
};

export const getOrdersByUserId = (userId) => {
  const orders = db
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId);

  return orders.map((order) => {
    const items = db
      .prepare('SELECT * FROM order_items WHERE order_id = ?')
      .all(order.id);
    return { ...order, items };
  });
};

export const getOrderById = (id, userId = null) => {
  const order = userId
    ? db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(id, userId)
    : db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

  if (!order) return null;

  const items = db
    .prepare('SELECT * FROM order_items WHERE order_id = ?')
    .all(order.id);

  return { ...order, items };
};

export const getAllOrders = () => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  return orders.map((order) => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(order.user_id);
    return { ...order, items, user };
  });
};
