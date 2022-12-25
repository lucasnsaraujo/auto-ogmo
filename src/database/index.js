import pg from 'pg'

const { Client } = pg

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '03100123',
    database: 'ogmo'
})

client.connect();

const query = async (query) => {
    const { rows } = await client.query(query);
    return rows;
}

const db = {query}
export default db;