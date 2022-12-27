import TelegramBot from "node-telegram-bot-api";

const isDeployed = !!["production", "development"].includes(
  process.env.CURRENT_ENV
);

const localToken = "example";
const TOKEN = isDeployed ? process.env.TELEGRAM_API_TOKEN : localToken;

// const bot = new TelegramBot(TOKEN, {
//   polling: true,
// });
