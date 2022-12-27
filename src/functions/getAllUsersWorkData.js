import UsersRepository from "../app/repositories/UsersRepository.js";
import WorksRepository from "../app/repositories/WorksRepository.js";
import TelegramRepository from "../app/repositories/TelegramRepository.js";
import { sendTelegramMessage } from "../services/telegram.js";
import { crawlWorkData } from "./crawlWorkData.js";

export async function getAllUsersWorkData() {
  const users = await UsersRepository.findUsersShouldUpdate();
  if (users.length) {
    for (const user of users) {
      const crawledData = await crawlWorkData({
        user_login: user?.user_login,
        user_password: user?.user_password,
      });
      if (crawledData) {
        const currentStatus = checkWorkDataStatus(crawledData?.data?.status);
        if (currentStatus === "assigned") {
          await WorksRepository.create({
            ...crawledData.data,
            user_id: user.id,
          });
          await UsersRepository.updateLastTimestamp(user.id);
          const { telegram_id } = await TelegramRepository.findByUserId(
            user.id
          );
          await sendTelegramMessage(telegram_id);
          console.log(`> New work created! => ${crawledData.name}`);
        } else {
          console.log(`> No updates for user: ${crawledData.name}`);
        }
      }
    }
  } else {
    console.log("> No update users found");
  }
}

const checkWorkDataStatus = (status) =>
  status && status.toLowerCase().includes("embarcado") ? "assigned" : "waiting";
