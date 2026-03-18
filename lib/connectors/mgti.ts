// lib/connectors/mgti.ts
import type { SupplierResult } from "../types";

const isProd = process.env.VERCEL === "1";

export async function searchMGTI(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  const results: SupplierResult[] = [];
  let browser: any = null;

  try {
    let puppeteer: any;
    let executablePath: string | undefined;

    if (isProd) {
      // ✅ Vercel
      const chromium = require("@sparticuz/chromium");
      puppeteer = require("puppeteer-core");

      executablePath = await chromium.executablePath();
      
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath,
        headless: chromium.headless,
      });

    } else {
      // ✅ Local
      puppeteer = require("puppeteer");

      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const pageBrowser = await browser.newPage();
    await pageBrowser.setUserAgent("Mozilla/5.0");

    await pageBrowser.setRequestInterception(true);
    pageBrowser.on("request", (req: any) => {
      if (["image", "font"].includes(req.resourceType())) req.abort();
      else req.continue();
    });

    const searchUrl = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${encodeURIComponent(query)}`;
    await pageBrowser.goto(searchUrl, { waitUntil: "domcontentloaded" });

    if (page > 1) {
      await pageBrowser.evaluate((p: number) => {
        (window as any).SearchGoToPage(p);
      }, page);

      await pageBrowser.waitForSelector("a.oxcell", { timeout: 10000 });
    }

    const data = await pageBrowser.evaluate(() => {
      const items: any[] = [];

      document.querySelectorAll("a.oxcell").forEach((el) => {
        const designation = el.querySelector(".PBItemName")?.textContent?.trim() || "";
        const reference =
          el.getAttribute("data-id") || "";

        let image = (el.querySelector("img") as HTMLImageElement)?.src || "";
        if (image && !image.startsWith("http")) image = "https://www.mgti.fr/" + image;

        let link = (el as HTMLAnchorElement).href || "";
        if (link && !link.startsWith("http")) link = "https://www.mgti.fr/" + link;

        if (designation && reference) {
          items.push({
            designation,
            reference,
            image,
            link,
            title: designation,
          });
        }
      });

      const hasMore = document.querySelector(".navbar") !== null;

      return { items, hasMore };
    });

    (data.items as SupplierResult[]).forEach((item) =>
      results.push({ ...item, supplier: "MGTI" })
    );

    return { results, hasMore: data.hasMore };

  } catch (err) {
    console.error("Erreur searchMGTI:", err);
    return { results: [], hasMore: false };
  } finally {
    if (browser) await browser.close();
  }
}