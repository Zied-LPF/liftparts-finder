// lib/connectors/mgti.ts
import type { SupplierResult } from "../types";
import puppeteer, { Browser } from "puppeteer";

export async function searchMGTI(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  const results: SupplierResult[] = [];
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new"
    });

    const pageBrowser = await browser.newPage();
    await pageBrowser.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

    // 🔹 Bloquer images/fonts pour accélérer
    await pageBrowser.setRequestInterception(true);
    pageBrowser.on("request", req => {
      if (["image", "font"].includes(req.resourceType())) req.abort();
      else req.continue();
    });

    // 🔽 Aller sur la page de recherche (page 1)
    const searchUrl = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${encodeURIComponent(query)}`;
    await pageBrowser.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 0 });

    // 🔽 Pagination via JS
    if (page > 1) {
      await pageBrowser.evaluate((p) => {
        (window as any).SearchGoToPage(p);
      }, page);

      // Attendre qu'au moins un produit soit visible
      await pageBrowser.waitForSelector("a.oxcell", { timeout: 10000 });
    }

    // 🔽 Extraction des produits
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