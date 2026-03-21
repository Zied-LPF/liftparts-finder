// lib/connectors/elevatorshop.ts
import type { SupplierResult } from '../types';
import { getBrowser } from '../puppeteer'; // ✅ AJOUT

export async function searchElevatorshop(
  query: string,
  pageNumber: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  const browser = await getBrowser(); // ✅ singleton

  let page: any;

  try {
    page = await browser.newPage();

    await page.setRequestInterception(true);
    (page as any).on('request', (req: any) => {
      const type = req.resourceType();
      if (['stylesheet', 'font', 'media'].includes(type)) req.abort();
      else req.continue();
    });

    const url = `https://www.elevatorshop.de/fr/search?search=${encodeURIComponent(
      query
    )}&p=${pageNumber}`;

    await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForSelector('.product-box', { timeout: 5000 }).catch(() => {});

    // ================= HAS MORE =================
    const hasMore: boolean = await page.evaluate((currentPage: number) => {
      const pages = Array.from(document.querySelectorAll('input[name="p"]'));
      const maxPage = Math.max(...pages.map((p: any) => Number(p.value) || 0));
      return currentPage < maxPage;
    }, pageNumber);

    // ================= PARSING =================
    const results: SupplierResult[] = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.product-box'));

      return items.map((card: any) => {
        const titleEl = card.querySelector('.product-name');
        const linkEl = card.querySelector('.product-image-link');
        const imgEl = card.querySelector('.product-image-wrapper img');
        const refEl = card.querySelector('.product-artikelnr');
        const stockEl = card.querySelector('.badge-success');

        const reference = refEl?.textContent?.match(/\d+/)?.[0] || '';
        const stock = stockEl?.textContent?.trim() || '';

        const link =
          linkEl?.href ||
          titleEl?.href ||
          (reference
            ? `https://www.elevatorshop.de/fr/search?search=${reference}`
            : '');

        return {
          supplier: 'ElevatorShop',
          title: titleEl?.textContent?.trim() || '',
          link,
          image: imgEl?.src || '',
          reference,
          stock,
        };
      });
    });

    return { results, hasMore };

  } catch (err) {
    console.error('Elevatorshop Puppeteer error:', err);
    return { results: [], hasMore: false };

  } finally {
    if (page) await page.close(); // ✅ CRITIQUE (singleton safe)
  }
}