import pg from "pg";

const { Client } = pg;

let POSTGRES_CONFIG;

const { CURRENT_ENV } = process.env;

if (["production", "development"].includes(CURRENT_ENV)) {
  POSTGRES_CONFIG = {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "ogmo",
  };
} else {
  POSTGRES_CONFIG = {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  };
}

const client = new Client(POSTGRES_CONFIG);

client.connect();

const query = async (query) => {
  const { rows } = await client.query(query);
  return rows;
};

const db = { query };
export default db;
