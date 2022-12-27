import db from "../../database";

class TelegramRepository {
  async generateUniqueKey({ length = 6 }) {
    // Generated random key (default: 6 characters)
    function generateRandom() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let generatedKey = "";
      for (let i = 0; i < length; i++) {
        generatedKey +=
          characters[Math.floor(Math.random() * characters.length)];
      }
      return generatedKey;
    }

    // Confirms if this key has not been generated before to any other user
    let generatedRandomKey = generateRandom();
    let generatedKeysInDb = await this.findByConfirmationKey(generatedKey);
    while (generatedKeysInDb.includes(generatedRandomKey)) {
      generatedRandomKey = generateRandom();
    }

    return generatedRandomKey;
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
  async findByConfirmationKey(confirmationKey) {
    const [row] = await db.query({
      text: `
        SELECT * FROM telegram
        WHERE confirmation_key = $1
        `,
      values: [confirmationKey],
    });
    return row;
  }
  async generateConfirmationKey(id) {
    const confirmationKey = this.generateUniqueKey();
    const [row] = await db.query({
      text: `
      UPDATE telegram
      SET confirmation_key = $1
      WHERE user_id = $2
      RETURNING *;
      `,
      values: [confirmationKey, id],
    });
    return row;
  }

  async registerTelegramIdToUser({ telegramId, id }) {
    const [row] = db.query({
      text: `
      UPDATE telegram
      SET telegram_id = $1
      WHERE user_id = $2
      RETURNING *;
      `,
      values: [telegramId, id],
    });
    return row;
  }
}

export default new TelegramRepository();
