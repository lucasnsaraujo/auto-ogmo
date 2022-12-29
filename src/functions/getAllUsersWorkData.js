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
      console.log({ crawledData, currentData });
      const statusHasChanged = checkIfDataHasChanged(currentData, crawledData);
      if (statusHasChanged) {
        console.log("> Status has changed.");
        await WorksRepository.update(user.id, {
          ...crawledData,
        });
        const { telegram_id } = await TelegramRepository.findByUserId(user.id);
        const isEmbarcado = checkIfUserIsEmbarcado(crawledData);
        if (telegram_id && isEmbarcado) {
          console.log({ telegram_id, isEmbarcado });
          const message = generateTelegramMessage(user, crawledData);
          await sendTelegramMessage(telegram_id, message);
          console.log(`> User is being called! => ${user?.name}`);
        } else if (isEmbarcado) {
          console.log(
            `> User called! Does not have Telegram configured [${user?.name}]`
          );
        }
      } else {
        console.log(`> No updates for user: ${user.name}`);
      }
    } else {
      console.log(
        `Could not crawl data. Possibly there are wrong credentials. [${user.name}]`
      );
    }
  }
}

const checkIfDataHasChanged = (currentData, crawledData) => {
  if (
    crawledData?.status !== currentData?.status &&
    !!crawledData?.parede &&
    !!crawledData.status
  ) {
    return true;
  }
  return false;
};

function checkIfUserIsEmbarcado(crawledData) {
  const { status } = crawledData;
  if (!status) {
    return false;
  }
  if (status?.toString()?.toLowerCase()?.includes("embarcado")) {
    return true;
  }
  return false;
}

function generateTelegramMessage(user, crawledData) {
  return `
    🚨 Você foi alocado!\n- Nome: ${user?.name}\n- Parede: ${crawledData?.parede}\n- Requi: ${crawledData?.requi}\n- Operação: ${crawledData?.operacao}\n- Turno: ${crawledData?.turno}\n- Ter: ${crawledData?.ter}\n- Função: ${crawledData?.funcao}\n- Forma: ${crawledData?.forma}\n- Navio: ${crawledData?.navio}\n- Ber: ${crawledData?.ber}\n- Cais: ${crawledData?.cais}\n- Requisitante: ${crawledData?.requisitante}\n- Status: ${crawledData?.status}
  `;
}
