import type { SupplierResult } from "../types";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function searchSodica(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  const results: SupplierResult[] = [];

  try {
    // =========================
    // 🔽 Construire l'URL /filter/
    // =========================
    const pageNumber = page - 1; // Sodica commence à 0
    const url = `https://sodica.fr/fr/filter/0?PageNumber=${pageNumber}&PageSize=12&SearchTerm=${encodeURIComponent(query)}`;

    console.log("SODICA URL:", url);

    // =========================
    // 🔽 Premier fetch pour récupérer cookies
    // =========================
    const initResp = await fetch("https://sodica.fr/fr/search", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9",
        "Referer": "https://sodica.fr/",
        "Connection": "keep-alive"
      }
    });

    const cookies = initResp.headers.get("set-cookie") || "";

    // =========================
    // 🔽 Fetch réel /filter/ avec cookies
    // =========================
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9",
        "Referer": "https://sodica.fr/",
        "Origin": "https://sodica.fr",
        "Connection": "keep-alive",
        "Cookie": cookies
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // =========================
    // 🔽 Sélection des produits
    // =========================
    $(".product-grid-item").each((_, el) => {
      const designation = $(el).find(".product-title").text().trim();
      const reference = $(el).find(".product-number-label").next().text().trim();
      let image = $(el).find("img").attr("src") || "";
      if (image && !image.startsWith("http")) image = "https://sodica.fr" + image;
      let link = $(el).find(".product-title").attr("href") || "";
      if (link && !link.startsWith("http")) link = "https://sodica.fr" + link;

      if (designation && reference) {
        results.push({
          supplier: "Sodica",
          designation,
          reference,
          image,
          stock: "",
          link,
          title: designation
        });
      }
    });

    // =========================
    // 🔽 Détection hasMore (présence du bouton suivant)
    // =========================
    const hasMore = $(".ph-caret-right").length > 0;

    console.log("Produits trouvés:", results.length);

    return { results, hasMore };

  } catch (err) {
    console.error("Erreur searchSodica:", err);
    return { results: [], hasMore: false };
  }
}