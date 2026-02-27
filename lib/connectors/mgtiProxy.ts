// lib/connectors/mgtiProxy.ts
import { chromium } from "playwright";

export async function fetchMgtiProductsProxy(query: string) {
  const url = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${encodeURIComponent(query)}`;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Optionnel : définir un user-agent réaliste
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145 Safari/537.36"
  );

  // Aller sur la page MGTI
  await page.goto(url, { waitUntil: "networkidle" });

  // Récupérer le HTML complet
  const content = await page.content();

  await browser.close();

  return parseMgtiHtml(content);
}

// Fonction de parsing HTML (exemple simple)
function parseMgtiHtml(html: string) {
  const regex = /<tr[^>]*>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([^<]*)<\/td>/g;
  const results: { ref: string; desc: string }[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    results.push({ ref: match[1].trim(), desc: match[2].trim() });
  }
  return results;
}