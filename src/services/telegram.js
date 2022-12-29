import { Telegraf } from "telegraf";
import TelegramController from "../app/controllers/TelegramController.js";
import TelegramRepository from "../app/repositories/TelegramRepository.js";
import UsersRepository from "../app/repositories/UsersRepository.js";
import WorksRepository from "../app/repositories/WorksRepository.js";

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
  const user = await checkIfUserIsActivated(ctx.message.from.id);
  if (user) {
    ctx.reply(`Sua conta já está registrada como ${user.name}.`);
  }
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
  } else {
    try {
      const data = await WorksRepository.findById(user.id);
      if (!data) {
        ctx.reply(
          "Não foi possível buscar os dados. Por favor, tente novamente mais tarde."
        );
        return;
      }
      const message = generateTelegramMessage(user, data);
      ctx.reply(message);
    } catch (err) {
      ctx.reply(`Ocorreu um erro. Tente novamente mais tarde`);
    }
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

function generateTelegramMessage(user, crawledData, type = "status") {
  return `${
    type === "status" ? `🚢 Status Atual!\n` : `🚨 Você foi alocado!\n`
  }${!!user.name ? `- Nome: ${user.name}\n` : ""}${
    !!crawledData.parede.toString() ? `- Parede: ${crawledData.parede}\n` : ""
  }${!!crawledData.requi.toString() ? `- Requi: ${crawledData.requi}\n` : ""}${
    !!crawledData.operacao.toString()
      ? `- Operação: ${crawledData.operacao}\n`
      : ""
  }${!!crawledData.turno.toString() ? `- Turno: ${crawledData.turno}\n` : ""}${
    !!crawledData.ter.toString() ? `- Ter: ${crawledData.ter}\n` : ""
  }${
    !!crawledData.funcao.toString() ? `- Função: ${crawledData.funcao}\n` : ""
  }${!!crawledData.forma.toString() ? `- Forma: ${crawledData.forma}\n` : ""}${
    !!crawledData.navio.toString() ? `- Navio: ${crawledData.navio}\n` : ""
  }${!!crawledData.ber.toString() ? `- Ber: ${crawledData.ber}\n` : ""}${
    !!crawledData.cais.toString() ? `- Cais: ${crawledData.cais}\n` : ""
  }${
    !!crawledData.requisitante.toString()
      ? `- Requisitante: ${crawledData.requisitante}\n`
      : ""
  }${!!crawledData.status.toString() ? `- Status: ${crawledData.status}\n` : ""}
  `;
}

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
export default bot;
