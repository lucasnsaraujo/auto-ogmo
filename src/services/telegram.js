import { Telegraf } from "telegraf";
import TelegramController from "../app/controllers/TelegramController.js";
import TelegramRepository from "../app/repositories/TelegramRepository.js";
import UsersRepository from "../app/repositories/UsersRepository.js";
import { crawlWorkData } from "../functions/crawlWorkData.js";

const isDeployed = !!["production", "development"].includes(
  process.env.CURRENT_ENV
);

const localApiKey = "5648742362:AAFPTI6HbngYuXm3JCtuNLmo6lcJTEt-oEQ";
const SECRET_API_TOKEN = isDeployed
  ? process.env.TELEGRAM_API_TOKEN
  : localApiKey;

const bot = new Telegraf(SECRET_API_TOKEN);

bot.start(async (ctx) => {
  const user = await checkIfUserIsActivated(ctx.message.from.id);
  if (!user) {
    ctx.reply(`Olá ${ctx.message.from.first_name}! Seja bem-vindo(a) ao bot do Auto Ogmo. Para ativar sua conta e receber as atualizações, digite '/registrar (seu e-mail) (seu código de ativação).\n\n Exemplo: \n/registrar guilherme@email.com ABC123
    `);
  } else {
    ctx.reply(`Seja bem vindo de volta ${user.name}!`);
  }
});

bot.command("registrar", async (ctx) => {
  if (ctx.message.text.trim() === "/registrar") {
    ctx.reply(
      `Para ativar sua conta, digite '/registrar' seguido do seu e-mail cadastrado e seu código de ativação. Exemplo: \n/registrar guilherme@email.com ABC123`
    );
  }
  const message = ctx.message.text.split(" ");
  if (message.length === 3) {
    const email = message[1];
    const key = message[2];
    const response = await TelegramController.validateKey({
      key,
      email,
      telegram_id: ctx.message.from.id,
    });
    if (response?.success) {
      const user = response?.data;
      ctx.reply(`Conta ativada com sucesso! Obrigado ${user.name}`);
    } else {
      ctx.reply(
        `Infelizmente ocorreu um erro. Tente novamente.\n${
          " - " + response?.error ?? ""
        }`
      );
    }
  }
});

bot.command("status", async (ctx) => {
  const user = await checkIfUserIsActivated(ctx.message.from.id);
  if (!user) {
    ctx.reply("Ative sua conta para receber suas atualizações!");
    return;
  }
  const credentials = await UsersRepository.findUserCredentialsById(user.id);
  if (credentials.user_login && credentials.user_password) {
    const { user_login, user_password } = credentials;
    const data = await crawlWorkData({ user_login, user_password });
    ctx.reply(JSON.stringify(data));
  }
});

export async function sendTelegramMessage(telegram_id, message) {
  bot.telegram.sendMessage(telegram_id, message);
  console.log(`--> Telegram message sent to ID [${telegram_id}]`);
}

async function checkIfUserIsActivated(id) {
  const telegramInfo = await TelegramRepository.findByTelegramId(id);
  if (!telegramInfo || typeof telegramInfo === "undefined") {
    return null;
  }
  const user_information = await UsersRepository.findById(telegramInfo.user_id);
  return { ...user_information, telegram: telegramInfo };
}

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
export default bot;
