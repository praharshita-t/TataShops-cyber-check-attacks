import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the database directory exists
const dbDir = path.resolve(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(__dirname, '..', process.env.DATABASE_PATH)
  : path.resolve(dbDir, 'tatashops.db');

const db = new Database(dbPath);

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

export default db;
