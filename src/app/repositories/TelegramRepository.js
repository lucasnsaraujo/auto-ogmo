import db from "../../database/index.js";
import UsersRepository from "./UsersRepository.js";

class TelegramRepository {
  async findByTelegramId(telegram_id) {
    const [row] = await db.query({
      text: `
    SELECT * FROM telegram WHERE telegram_id = $1;
    `,
      values: [telegram_id],
    });
    return row ?? null;
  }

  async _generateUniqueKey(length = 6) {
    // Generated random key (default: 6 characters)
    function generateRandom() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let generatedKey = "";
      for (let i = 0; i < length; i++) {
        generatedKey +=
          characters[Math.floor(Math.random() * characters?.length)];
      }
      return generatedKey;
    }

    // Confirms if this key has not been generated before to any other user
    let key = generateRandom();
    let databaseItems = await this.findAll();
    let keysAlreadyUsed = databaseItems.map((item) => item?.["activation_key"]);
    while (keysAlreadyUsed?.length && keysAlreadyUsed.includes(key)) {
      key = generateRandom();
    }

    return key;
  }

  async findAll() {
    const row = await db.query("SELECT * FROM telegram");
    return row;
  }
  async findByUserId(id) {
    const [row] = await db.query({
      text: `
        SELECT * FROM telegram
        WHERE user_id = $1
        `,
      values: [id],
    });
    return row;
  }
  async findByActivationKey(activationKey) {
    const [row] = await db.query({
      text: `
        SELECT * FROM telegram
        WHERE activation_key = $1
        `,
      values: [activationKey],
    });
    return typeof row !== "undefined" ? row : null;
  }
  async updateActivationKey(id) {
    const activationKey = await this._generateUniqueKey();
    const [row] = await db.query({
      text: `
      UPDATE telegram
      SET activation_key = $1
      WHERE user_id = $2
      RETURNING *;
      `,
      values: [activationKey, id],
    });
    return row;
  }
  async generateActivationKey(id) {
    const activationKey = await this._generateUniqueKey();
    const [row] = await db.query({
      text: `
      INSERT INTO telegram (user_id, activation_key)
      VALUES ($1, $2)
      RETURNING *;
      `,
      values: [id, activationKey],
    });
    return row;
  }

  async registerTelegramIdToUser(id, telegramId) {
    await db.query({
      text: `
      UPDATE telegram
      SET telegram_id = $1, activation_key = NULL
      WHERE user_id = $2
      RETURNING *;
      `,
      values: [telegramId, id],
    });
    await UsersRepository.setUserActive(id);
    return true;
  }
}

export default new TelegramRepository();
