import db from "../../database/index.js";
class UsersRepository {
  async findAll() {}
  async findById() {}
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
    console.log(user)
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
  async update(id, data) {}
  async delete(id) {}
}

export default new UsersRepository;