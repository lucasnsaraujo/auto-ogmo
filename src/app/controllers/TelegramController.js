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
      await TelegramRepository.registerTelegramIdToUser(user?.id, telegram_id);
      return response.status(200).json({ success: true });
    }
    return response.status(400).json({ error: "Something went wrong" });
  }
  async validateKey({ key, email, telegram_id }) {
    if (!key) return { error: "Chave de ativação obrigatória" };

    if (!email) return { error: "Email obrigatório" };

    if (!telegram_id) return { error: "ID do Telegram obrigatório" };

    const validActivationKey = await TelegramRepository.findByActivationKey(
      key
    );
    if (!validActivationKey) return { error: "Chave de ativação inválida" };

    const user = await UsersRepository.findById(validActivationKey?.user_id);
    const keyToCompare = validActivationKey?.activation_key
      ?.toString()
      ?.toLowerCase()
      ?.trim();
    const keyToActivate = key?.toString()?.toLowerCase()?.trim();
    if (
      keyToActivate === keyToCompare &&
      user?.email.toString()?.trim() === email?.toString()?.trim()
    ) {
      await TelegramRepository.registerTelegramIdToUser(user?.id, telegram_id);
      return { success: true, data: user };
    }
    return { error: "Algo deu errado. Tente novamente mais tarde." };
  }
}

export default new TelegramController();
