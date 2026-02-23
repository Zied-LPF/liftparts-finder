import { chromium } from "playwright";

interface MgtiItem {
  supplier: string;
  ref: string;
  label: string;
  url: string;
  image: string;
}

async function scrapeMgti(searchText: string): Promise<MgtiItem[]> {
  const browser = await chromium.launch({ headless: false }); // headless false pour debug
  const page = await browser.newPage();

  const url = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${searchText}`;
  console.log("Loading:", url);
  await page.goto(url);

  // Attente que les produits soient chargés
  await page.waitForSelector("a.oxcell.instock", { timeout: 20000 });

  // Récupération des produits
  const items = await page.evaluate(() => {
    const results: any[] = [];
    const products = document.querySelectorAll("a.oxcell.instock");

    products.forEach(product => {
      const ref = product.querySelector(".c-cs-product-display__cell-inner")?.textContent?.trim() || "";
      const label = product.querySelector(".PBItemName")?.textContent?.trim() || "";
      const href = product.getAttribute("href") || "";
      const fullUrl = href.startsWith("http") ? href : `https://www.mgti.fr/${href}`;

      const imgSrc = product.querySelector("img")?.getAttribute("src") || "";
      const image = imgSrc && imgSrc !== "/" ? (imgSrc.startsWith("http") ? imgSrc : `https://www.mgti.fr/${imgSrc}`) : "";

      results.push({
        supplier: "MGTI",
        ref,
        label,
        url: fullUrl,
        image
      });
    });

    return results;
  });

  await browser.close();
  return items;
}

// Exemple d'utilisation
(async () => {
  const searchText = "5300";
  const results = await scrapeMgti(searchText);
  console.log("Found:", results.length);
  console.log(results);
})();