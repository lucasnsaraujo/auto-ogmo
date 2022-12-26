import db from "../../database/index.js";
class UsersRepository {
  async findUsersShouldUpdate() {
    const row = await db.query(`
    SELECT * FROM users 
    WHERE (should_update = true) 
    AND (last_update <= (CURRENT_TIMESTAMP - interval '5 hours') OR last_update IS NULL);
    `);
    return row;
  }
  async updateLastTimestamp(id) {
    const [row] = await db.query({
      text: `
    UPDATE users 
    SET last_update = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
    `,
      values: [id],
    });
    return row;
  }
  async findByPhoneNumber(phone_number) {
    const [row] = await db.query({
      text: `SELECT * FROM users WHERE phone_number = $1`,
      values: [phone_number],
    });
    return row;
  }
  async findByEmail(email) {
    const [row] = await db.query({
      text: `SELECT * FROM users WHERE email = $1`,
      values: [email],
    });
    return row;
  }
  async findAll() {
    const row = await db.query(`SELECT * FROM users`);
    return row;
  }
  async findById(id) {
    const [row] = await db.query({
      text: `SELECT * FROM users WHERE id = $1`,
      values: [id],
    });
    return row;
  }
  async create(user) {
    const { name, email, phone_number, user_login, user_password } = user;
    const [row] = await db.query({
      text: ` 
          INSERT INTO users (name, email, phone_number, user_login, user_password)
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING * 
          `,
      values: [name, email, phone_number, user_login, user_password],
    });
    return row;
  }
  async update(id, data) {
    const { name, email, phone_number, user_login, user_password } = data;
    const [row] = await db.query({
      text: `UPDATE users
      SET name = $1, 
      email = $2, 
      phone_number = $3, 
      user_login = $4, 
      user_password = $5
      WHERE id = $6
      RETURNING *
      `,
      values: [name, email, phone_number, user_login, user_password, id],
    });
    return row;
  }
  async delete(id) {
    const deleteOperation = await db.query({
      text: `
      DELETE FROM users 
      WHERE id = $1
    `,
      values: [id],
    });
    return deleteOperation;
  }
}

export default new UsersRepository();
