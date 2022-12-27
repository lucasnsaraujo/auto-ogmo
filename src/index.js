import "express-async-errors";
import express from "express";
import ns from "node-schedule";
import { getAllUsersWorkData } from "./functions/getAllUsersWorkData.js";
import routes from "./routes.js";
import { bot, bot as TelegramBot } from "./services/telegram.js";

const app = express();

app.use(express.json());

app.use(routes);

// ns.scheduleJob("*/10 * * * * *", async () => {
// UPDATE EVERY 10 SECONDS - DEVELOPMENT ONLY!
ns.scheduleJob("*/10 * * * *", async () => {
  console.log("====================================");
  console.log("|         Iniciando Job...         |");
  console.log("====================================");
  await getAllUsersWorkData();
});

// Port based on current environment;
let PORT;
const { CURRENT_ENV } = process.env;
if (["production", "development"].includes(CURRENT_ENV)) {
  PORT = process.env.PORT;
} else {
  PORT = 1234;
}

TelegramBot.onText(/\/registrar/, (msg) => {
  const options = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: ["Gostaria de registrar", "testando"],
    }),
  };
  bot.sendMessage(msg.chat.id, "Teste", options);
});

app.listen(PORT, () => {
  console.log(
    `> 💻 auto-ogmo-api started @ port ${PORT} in ${
      CURRENT_ENV ?? "development"
    }`
  );
});
