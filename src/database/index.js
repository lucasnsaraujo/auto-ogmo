import pg from "pg";

const { Client } = pg;

const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

client.connect();

const query = async (query) => {
  const { rows } = await client.query(query);
  return rows;
};

const db = { query };
export default db;
