import TelegramRepository from "../repositories/TelegramRepository.js";
import UsersRepository from "../repositories/UsersRepository.js";
class TelegramController {
  async activate(request, response) {
    const { key, email, telegram_id } = request.body;

    if (!key) return response.status(400).json({ error: "Missing key" });

    if (!email) return response.status(400).json({ error: "Missing e-mail" });

    if (!telegram_id)
      return response.status(400).json({ error: "Missing telegram ID" });

    const validActivationKey = await TelegramRepository.findByActivationKey(
      key
    );
    if (!validActivationKey)
      return response.status(400).json({ error: "Activation key not valid" });

    const user = await UsersRepository.findById(validActivationKey?.user_id);

    console.log({ user, validActivationKey });

    if (validActivationKey?.activation_key === key && user?.email === email) {
      await TelegramRepository.registerTelegramIdToUser(user.id, telegram_id);
      return response.status(200).json({ success: true });
    }
    return response.status(400).json({ error: "Something went wrong" });
  }
}

export default new TelegramController();
