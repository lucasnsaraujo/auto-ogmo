import db from "../../database/index.js";
class UsersRepository {
  async setUserActive(id) {
    await db.query({
      text: `UPDATE users
      SET active = true
      WHERE id = $2
      `,
      values: [id],
    });
    return;
  }
  async setUserDeactive(id) {
    await db.query({
      text: `UPDATE users
      SET active = false
      WHERE id = $2
      `,
      values: [id],
    });
    return;
  }
  async findUsersShouldUpdate() {
    const usersWith6hourGap = await db.query(`
    SELECT users.*, works.last_update FROM users JOIN works ON users.id=works.user_id
    WHERE (users.active = true) 
    AND (works.last_update <= (CURRENT_TIMESTAMP - interval '5 hours') OR works.last_update IS NULL)
    `);
    const row = await db.query(`
    SELECT users.*, works.last_update FROM users JOIN works ON users.id=works.user_id
    WHERE (users.active = true)
    `);
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
    const row = await db.query(
      `SELECT id, name, email, phone_number, created_at FROM users`
    );
    return row;
  }
  async findById(id) {
    const [row] = await db.query({
      text: `SELECT id, active, name, email, phone_number, created_at FROM users WHERE id = $1`,
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
