// lib/connectors/mgti.ts
import type { SupplierResult } from "../types";
import { getBrowser } from "../puppeteer"; // ✅ AJOUT

export async function searchMGTI(
  query: string,
  pageNumber: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  // ✅ PLUS DE puppeteer.launch ici
  const browser = await getBrowser()

  let page: any

  try {
    page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0");

    // 🚀 Bloquer ressources inutiles
    await page.setRequestInterception(true);
    (page as any).on("request", (req: any) => {
      const type = req.resourceType();
      if (["image", "font", "stylesheet", "media"].includes(type)) req.abort();
      else req.continue();
    });

    const searchUrl = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${encodeURIComponent(query)}`;

    // ✅ IMPORTANT : attendre le rendu JS Oxatis
    await page.goto(searchUrl, { waitUntil: "networkidle2" }).catch(() => {});

    // attendre que les produits soient injectés
    await page.waitForSelector(".PBItemName", { timeout: 15000 });

    // petit délai de sécurité (Oxatis lent)
    await new Promise(res => setTimeout(res, 2000));

    // 🔁 Pagination JS (si >1)
    if (pageNumber > 1) {
      await page.evaluate((p: number) => {
        (window as any).SearchGoToPage(p);
      }, pageNumber);

      await page.waitForSelector(".PBItemName", { timeout: 10000 });
    }

    // 📦 Extraction
    const data: { items: SupplierResult[]; hasMore: boolean } =
      await page.evaluate(() => {
        const items: SupplierResult[] = [];

        document.querySelectorAll("a.oxcell").forEach((el: any) => {
          const designation =
            el.querySelector(".PBItemName")?.textContent?.trim() || "";

          const reference =
            el.querySelector(".c-cs-product-display__cell-inner")?.textContent?.trim() ||
            el.getAttribute("data-id") ||
            "";

          let image = el.querySelector("img")?.src || "";
          if (image && !image.startsWith("http")) {
            image = "https://www.mgti.fr/" + image;
          }

          let link = el.href || "";
          if (link && !link.startsWith("http")) {
            link = "https://www.mgti.fr/" + link;
          }

          const stock =
            el.querySelector(".PBMsgInStock")?.textContent?.trim() || "";

          if (designation && reference) {
            items.push({
              supplier: "MGTI",
              title: designation,
              designation,
              reference,
              image,
              link,
              stock,
            } as SupplierResult);
          }
        });

        // 🔁 Détection pagination
        const hasMore = Array.from(document.querySelectorAll(".navbar a")).some(
          (a: any) => {
            const href = a.getAttribute("href") || "";
            return (
              href.includes("SearchGoToPage") &&
              !a.querySelector("span")?.classList.contains("off")
            );
          }
        );

        return { items, hasMore };
      });

    console.log(`MGTI page ${pageNumber} → ${data.items.length} résultats`);

    return {
      results: data.items,
      hasMore: data.hasMore
    };

  } catch (err) {
    console.error("Erreur searchMGTI:", err);
    return { results: [], hasMore: false };
  } finally {
    if (page) await page.close(); // ✅ CRITIQUE (remplace browser.close)
  }
}