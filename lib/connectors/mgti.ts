// lib/connectors/mgti.ts
import type { SupplierResult } from "../types";
import puppeteer, { Browser } from "puppeteer"; // pour local
import type { LaunchOptions } from "puppeteer-core";

let isProd = process.env.VERCEL === "1"; // true sur Vercel

let chromium: any = null;
let puppeteerCore: any = null;

if (isProd) {
  chromium = require("chrome-aws-lambda");
  puppeteerCore = require("puppeteer-core");
}

export async function searchMGTI(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {
  const results: SupplierResult[] = [];
  let browser: Browser | null = null;

  try {
    const launchOptions: LaunchOptions =
      isProd
        ? {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
          }
        : {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          };

    browser = isProd
      ? await puppeteerCore.launch(launchOptions)
      : await puppeteer.launch(launchOptions);

    const pageBrowser = await browser.newPage();
    await pageBrowser.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

    // Bloquer images/fonts pour accélérer
    await pageBrowser.setRequestInterception(true);
    pageBrowser.on("request", req => {
      if (["image", "font"].includes(req.resourceType())) req.abort();
      else req.continue();
    });

    // URL recherche
    const searchUrl = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${encodeURIComponent(query)}`;
    await pageBrowser.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 0 });

    if (page > 1) {
      await pageBrowser.evaluate((p) => (window as any).SearchGoToPage(p), page);
      await pageBrowser.waitForSelector("a.oxcell", { timeout: 10000 });
    }

    const data = await pageBrowser.evaluate(() => {
      const items: any[] = [];
      document.querySelectorAll("a.oxcell").forEach((el) => {
        const designation = el.querySelector(".PBItemName")?.textContent?.trim() || "";
        const reference =
          el.querySelector(".c-cs-product-display__cell-inner")?.textContent?.trim() ||
          el.getAttribute("data-id") ||
          "";
        let image = (el.querySelector("img") as HTMLImageElement)?.src || "";
        if (image && !image.startsWith("http")) image = "https://www.mgti.fr/" + image;
        let link = (el as HTMLAnchorElement).href || "";
        if (link && !link.startsWith("http")) link = "https://www.mgti.fr/" + link;
        const stock = el.querySelector(".PBMsgInStock")?.textContent?.trim() || "";

        if (designation && reference) {
          items.push({ designation, reference, image, link, stock, title: designation });
        }
      });

      const hasMore = Array.from(document.querySelectorAll(".navbar a")).some(a => {
        const href = (a as HTMLAnchorElement).getAttribute("href") || "";
        return href.includes("SearchGoToPage") && !a.querySelector("span")?.classList.contains("off");
      });

      return { items, hasMore };
    });

    data.items.forEach(item => results.push({ ...item, supplier: "MGTI" }));
    console.log(`MGTI page: ${page} produits: ${results.length} hasMore: ${data.hasMore}`);

    return { results, hasMore: data.hasMore };
  } catch (err) {
    console.error("Erreur searchMGTI:", err);
    return { results: [], hasMore: false };
  } finally {
    if (browser) await browser.close();
  }
}