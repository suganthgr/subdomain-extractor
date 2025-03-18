const axios = require("axios");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function getSubdomains(domainname, url) {
  try {
    const htmlContent = await Promise.any([
      fetchWithAxios(domainname),
      fetchWithPuppeteer(domainname),
    ]);

    const regexPattern = new RegExp(
      `(?:[a-zA-Z0-9-]+\\.)+${url.replace(/\./g, "\\.")}`,
      "gi"
    );
    return [
      ...new Set([...htmlContent.matchAll(regexPattern)].map((m) => m[0])),
    ];
  } catch (error) {
    console.error("Error extracting subdomains:", error.message);
    return [];
  }
}

async function fetchWithAxios(domainname) {
  const response = await axios.get(domainname);
  return response.data;
}

async function fetchWithPuppeteer(domainname) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let pageContent = "";
  const MAX_RETRIES = 3;
  try {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await page.goto(domainname, {
          waitUntil: "networkidle2",
          timeout: 6000,
        });
        console.log(`Page loaded successfully on attempt ${attempt}`);
        pageContent = await page.content();
        break;
      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err.message);
        if (attempt === MAX_RETRIES) throw err;
      }
    }
  } catch (err) {
    console.error("Error loading page:", err.message);
  } finally {
    await browser.close();
  }

  return pageContent;
}

module.exports = { getSubdomains };
