// lib/connectors/liftshop.ts
import type { SupplierResult } from "../types"
import * as cheerio from "cheerio"

const BASE_URL = "https://www.liftshop.fr"
const PAGE_SIZE = 20

export async function searchLiftshop(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  const results: SupplierResult[] = []

  try {
    const url = `${BASE_URL}/?s=${encodeURIComponent(query)}&post_type=product&type_aws=true&paged=${page}`

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9",
        "Referer": BASE_URL
      }
    })

    if (!res.ok) {
      console.error("LiftShop fetch error:", res.status)
      return { results: [], hasMore: false }
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    // WooCommerce standard : chaque produit est un <li class="product ...">
    $("li.product").each((_, el) => {
      // Titre
      const title =
        $(el).find(".woocommerce-loop-product__title").text().trim() ||
        $(el).find("h2").text().trim() ||
        $(el).find(".product-title").text().trim() ||
        ""

      // Lien produit
      const link =
        $(el).find("a.woocommerce-loop-product__link").attr("href") ||
        $(el).find("a").first().attr("href") ||
        ""

      // Image
      const image =
        $(el).find("img").attr("data-src") ||
        $(el).find("img").attr("src") ||
        ""

      // Référence : souvent dans le titre ou un attribut data
      // Sur LiftShop les références sont dans le titre (ex: "Kone – KM853538G02 – ...")
      const refMatch = title.match(/[A-Z0-9]{5,}(?:[A-Z0-9\-\.]{2,})?/g)
      const reference = refMatch ? refMatch[0] : ""

      // Stock : WooCommerce affiche "En stock" / "Rupture de stock"
      const stockEl =
        $(el).find(".stock").text().trim() ||
        $(el).find(".in-stock").text().trim() ||
        ""

      if (title && link) {
        results.push({
          supplier: "LiftShop",
          title,
          designation: title,
          reference,
          image,
          stock: stockEl || undefined,
          link
        } as SupplierResult)
      }
    })

    console.log(`LiftShop page ${page} → ${results.length} résultats`)

    // Pagination : présence du lien "Suivant" ou page suivante
    const hasMore =
      $("a.next.page-numbers").length > 0 ||
      $(`.page-numbers a[href*="paged=${page + 1}"]`).length > 0

    return { results, hasMore }

  } catch (err) {
    console.error("LiftShop search error:", err)
    return { results: [], hasMore: false }
  }
}
