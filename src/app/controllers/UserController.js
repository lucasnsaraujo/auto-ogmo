import UsersRepository from "../repositories/UsersRepository.js";
class UserController {
  async index(request, response) {}
  async show(request, response) {}

  async store(request, response) {
    const data = request.body;
    const isBodyValid = checkIfHasAllParameters(data);

    const {
      name,
      company_id,
      company_role,
      email,
      phone_number,
      user_login,
      user_password,
    } = data;

    if (isBodyValid) {
      const user = await UsersRepository.create({
        name,
        company_id,
        company_role,
        email,
        phone_number,
        user_login,
        user_password,
      });
      return response.status(201).json(user);
    } else {
      return response.status(400).json({
        error: "Some attributes are missing",
        required: USER_MODEL,
      });
    }
  }

  async update(request, response) {}
  async delete(request, response) {}
}

function checkIfHasAllParameters(data) {
  if (
    !data.name ||
    !data.company_id ||
    !data.company_role ||
    !data.email ||
    !data.phone_number ||
    !data.user_login ||
    !data.user_password
  ) {
    return false;
  }
  return true;
}
const USER_MODEL = [
  "name",
  "company_id",
  "company_role",
  "email",
  "phone_number",
  "user_login",
  "user_password",
];

export default new UserController();
