import puppeteer from "puppeteer";

const LOGIN_PAGE_URL = "https://ogmoes.com.br/intranet//Login.aspx";

export async function crawlWorkData({ user_login, user_password }) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(LOGIN_PAGE_URL, { waitUntil: "networkidle2" });

  await page.type("#txtLogin", user_login);
  await page.type("#txtSenha", user_password);

  // As the documentation recommends, wait for page to load after clicking on login button
  await Promise.all([
    page.click("#ImgBtnLogin"),
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
  ]);

  // Searching for the user information on the page header
  try {
    const user = await page?.evaluate(() => {
      const header = document.getElementById("lblUsuario").innerText;
      const name = header.split("-")[1].split("(")[0].trim();
      const request_time = Date.now().toString();
      return {
        name,
        request_time,
      };
    });

    // Searching for the iframe that has the table rendered
    const iframeElement = await page.$("iframe[id='Iframe1']");
    const frame = await iframeElement?.contentFrame();
    const table = await frame?.$("#GridViewParedes");

    // Mapping table data
    // REMINDER: In the future, make this function more automatic, getting the headers from the table
    // instead of manually
    let data;

    data = await table?.evaluate(() => {
      const contentRow = document.querySelectorAll(
        "tbody > tr:nth-child(2) > td"
      );
      const content = Array.from(contentRow)
        .map((item) => item.innerText.trim())
        .filter((x, index) => index >= 5);
      return {
        parede: content[0],
        requi: content[1],
        operacao: content[2],
        turno: content[3],
        ter: content[4],
        funcao: content[5],
        forma: content[6],
        navio: content[7],
        ber: content[8],
        cais: content[9],
        requisitante: content[10],
        status: content[11],
      };
    });
    await browser.close();
    return { ...data };
  } catch (error) {
    return null;
  }
}
