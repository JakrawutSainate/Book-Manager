// src/config.ts
import { config } from 'dotenv';
config(); // โหลดตัวแปรจาก .env

export const PORT = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 5000;

export const DB_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
    ? parseInt(process.env.DB_PORT, 10)
    : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
