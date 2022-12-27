import UsersRepository from "../app/repositories/UsersRepository.js";
import WorksRepository from "../app/repositories/WorksRepository.js";
import TelegramRepository from "../app/repositories/TelegramRepository.js";
import { sendTelegramMessage } from "../services/telegram.js";
import { crawlWorkData } from "./crawlWorkData.js";

export async function getAllUsersWorkData() {
  const users = await UsersRepository.findUsersShouldUpdate();
  if (!users.length) {
    console.log("> No update users found");
    return;
  }
  for (const user of users) {
    const crawledData = await crawlWorkData({
      user_login: user?.user_login,
      user_password: user?.user_password,
    });
    if (crawledData) {
      const currentData = await WorksRepository.findById(user.id);
      const statusHasChanged = checkIfDataHasChanged(currentData, crawledData);
      if (statusHasChanged) {
        await WorksRepository.update(user.id, {
          ...crawledData,
        });
        const { telegram_id } = await TelegramRepository.findByUserId(user.id);
        if (telegram_id) {
          await sendTelegramMessage(telegram_id);
          console.log(`> New work created! => ${user?.name}`);
        } else {
          console.log(
            `> Work created! But Telegram ID was not found for user: [${user?.name}]`
          );
        }
      } else {
        console.log(`> No updates for user: ${user.name}`);
      }
    }
  }
}

const checkIfDataHasChanged = (currentData, crawledData) => {
  if (
    crawledData?.parede === currentData?.parede &&
    crawledData?.status === currentData?.status
  ) {
    return false;
  }
  return true;
};
