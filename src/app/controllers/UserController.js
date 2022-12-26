import UsersRepository from "../repositories/UsersRepository.js";
class UserController {
  async index(request, response) {
    const users = await UsersRepository.findAll();
    return response.status(200).json(users);
  }
  async show(request, response) {
    const { id } = request.params;
    const user = await UsersRepository.findById(id);
    if (user) {
      return response.status(200).json(user);
    } else {
      return response.status(400).json({ error: "User not found" });
    }
  }

  async store(request, response) {
    const data = request.body;

    const {
      name,
      company_id,
      company_role,
      email,
      phone_number,
      user_login,
      user_password,
    } = data;

    const userExists = await UsersRepository.findByEmail(email);
    if (userExists) {
      return response
        .status(400)
        .json({ error: "This e-mail is already being used" });
    }

    const phoneNumberExists = await UsersRepository.findByPhoneNumber(
      phone_number
    );
    if (phoneNumberExists) {
      return response
        .status(400)
        .json({ error: "This phone number is already being used" });
    }

    const isBodyValid = checkIfHasAllParameters(data);
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

  async update(request, response) {
    const { id } = request.params;
    const data = request.body;

    const isBodyValid = checkIfHasAllParameters(data);
    if (isBodyValid && id) {
      const user = await UsersRepository.update(id, data);
      return response.status(200).json(user);
    } else {
      return response.status(400).json({
        error: "Some attributes are missing",
        required: USER_MODEL,
      });
    }
  }
  async delete(request, response) {
    const { id } = request.params;
    await UsersRepository.delete(id);
    return response.sendStatus(200);
  }
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
