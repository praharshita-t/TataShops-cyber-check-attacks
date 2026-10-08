import db from '../config/database.js';

export const getAllProducts = () => {
  const stmt = db.prepare('SELECT * FROM products ORDER BY id ASC');
  return stmt.all();
};

export const getProductById = (id) => {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  return stmt.get(id);
};

export const searchProducts = (query) => {
  // Intentionally vulnerable: User input interpolated directly into SQL string (A03 SQL Injection)
  const sql = `SELECT * FROM products WHERE name LIKE '%${query}%' OR category LIKE '%${query}%' OR description LIKE '%${query}%' ORDER BY id ASC`;
  const stmt = db.prepare(sql);
  return stmt.all();
};

export const createProduct = ({
  name,
  description = '',
  price,
  category,
  stock = 0,
  image = '',
  rating = 0,
}) => {
  const stmt = db.prepare(`
    INSERT INTO products (name, description, price, category, stock, image, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(name, description, price, category, stock, image, rating);
  return getProductById(result.lastInsertRowid);
};

export const updateProduct = (id, productData) => {
  const existing = getProductById(id);
  if (!existing) return null;

  const stmt = db.prepare(`
    UPDATE products 
    SET name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        category = COALESCE(?, category),
        stock = COALESCE(?, stock),
        image = COALESCE(?, image),
        rating = COALESCE(?, rating)
    WHERE id = ?
  `);

  stmt.run(
    productData.name ?? existing.name,
    productData.description ?? existing.description,
    productData.price !== undefined ? Number(productData.price) : existing.price,
    productData.category ?? existing.category,
    productData.stock !== undefined ? Number(productData.stock) : existing.stock,
    productData.image ?? existing.image,
    productData.rating !== undefined ? Number(productData.rating) : existing.rating,
    id
  );

  return getProductById(id);
};

export const deleteProduct = (id) => {
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
};
