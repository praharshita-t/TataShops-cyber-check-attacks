import db from '../config/database.js';

export const createUser = ({ name, email, password, role = 'user', phone = '', address = '' }) => {
  const stmt = db.prepare(`
    INSERT INTO users (name, email, password, role, phone, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(name, email, password, role, phone, address);
  return { id: result.lastInsertRowid, name, email, role, phone, address };
};

export const findUserByEmail = (email) => {
  const stmt = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)');
  return stmt.get(email);
};

export const findUserById = (id) => {
  const stmt = db.prepare(`
    SELECT id, name, email, role, phone, address, created_at 
    FROM users 
    WHERE id = ?
  `);
  return stmt.get(id);
};

export const updateUserProfile = (id, { name, phone, address }) => {
  const stmt = db.prepare(`
    UPDATE users 
    SET name = COALESCE(?, name),
        phone = COALESCE(?, phone),
        address = COALESCE(?, address)
    WHERE id = ?
  `);
  stmt.run(name, phone, address, id);
  return findUserById(id);
};

export const getAllUsers = () => {
  const stmt = db.prepare(`
    SELECT id, name, email, role, phone, address, created_at 
    FROM users 
    ORDER BY created_at DESC
  `);
  return stmt.all();
};
