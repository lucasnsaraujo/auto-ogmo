const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.globo.com", { waitUntil: "networkidle2" });

  const dimensions = await page.evaluate(() => {
    return {
        width: document.documentElement.clientWidth
    }
  })
  console.log({dimensions})

  await browser.close()
})();
