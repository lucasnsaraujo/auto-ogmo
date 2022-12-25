import { Client } from 'pg'

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'root',
    password: '03100123',
    database: 'ogmodb'
})

client.connect();

export const query = async (query) => {
    const { rows } = await client.query(query);
    return rows;
}