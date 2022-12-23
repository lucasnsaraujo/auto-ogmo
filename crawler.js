const puppeteer = require("puppeteer");
const { tableParser } = require("puppeteer-table-parser");

const LOGIN_PAGE_URL = "https://ogmoes.com.br/intranet//Login.aspx";
const USER_LOGIN = "4272";
const USER_PASSWORD = "3233";

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(LOGIN_PAGE_URL, { waitUntil: "networkidle2" });

  await page.type("#txtLogin", USER_LOGIN);
  await page.type("#txtSenha", USER_PASSWORD);

  await Promise.all([
    page.click("#ImgBtnLogin"),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  const user = await page.evaluate(() => {
    const header = document.getElementById("lblUsuario").innerText;

    const name = header.split("-")[1].split("(")[0].trim();
    const company_id = header.split("-")[0].trim();
    const company_role = header.split(" ").at(-1);
    const request_time = Date.now().toString();
    return {
      name,
      company_id,
      company_role,
      request_time,
    };
  });

  await page.waitForSelector("#PanelEmbarque");

  const work = await page.evaluate(() => {
    const table = Array.from(
      document.querySelectorAll("#PanelEmbarque > table > tbody > tr")
    ).map((item) => item.innerText);
    return { table };
  });
  await delay(1);

  const parsed_info = { user, work };

  //console.log(parsed_info);
  console.log(work);

  await browser.close();
})();
