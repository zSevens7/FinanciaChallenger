import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Força o caminho do .env
dotenv.config({ path: new URL('../../backend/.env', import.meta.url).pathname });

export const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
