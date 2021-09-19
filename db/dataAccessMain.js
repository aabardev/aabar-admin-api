import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
// console.log(connectionString);

const pool = new Pool({ connectionString });

export const query = async (text, params) => {
  const res = await pool.query(text, params);
  return res;
};