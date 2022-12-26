import db from "../../database/index.js";
class UsersRepository {
  async updateLastTimestamp(id) {
    const [row] = await db.query({
      text: `
    INSERT INTO users (last_update)
    VALUES (CURRENT_TIMESTAMP)
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
    const {
      name,
      company_id,
      company_role,
      email,
      phone_number,
      user_login,
      user_password,
    } = user;
    const [row] = await db.query({
      text: ` 
          INSERT INTO users (name, company_id, company_role, email, phone_number, user_login, user_password)
          VALUES ($1, $2, $3, $4, $5, $6, $7) 
          RETURNING * 
          `,
      values: [
        name,
        company_id,
        company_role,
        email,
        phone_number,
        user_login,
        user_password,
      ],
    });
    return row;
  }
  async update(id, data) {
    const {
      name,
      company_id,
      company_role,
      email,
      phone_number,
      user_login,
      user_password,
    } = data;
    const [row] = await db.query({
      text: `INSERT INTO users (name, company_id, company_role, email, phone_number, user_login, user_password)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      WHERE id = $8
      RETURNING *
      `,
      values: [
        name,
        company_id,
        company_role,
        email,
        phone_number,
        user_login,
        user_password,
        id,
      ],
    });
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
