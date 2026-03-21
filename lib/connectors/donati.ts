import type { SupplierResult } from "../types";

const HASHID = "26b9078a406213ca38a552a9fe995879";

export async function searchDonati(
  query: string,
  page: number = 1
): Promise<{ results: SupplierResult[]; hasMore: boolean }> {

  try {

    const url =
      `https://eu1-search.doofinder.com/5/search` +
      `?hashid=${HASHID}` +
      `&query=${encodeURIComponent(query)}` +
      `&page=${page}` +
      `&rpp=30` +
      `&query_name=match_and` +
      `&session_id=${Date.now()}`;

    const res = await fetch(url, {
      headers: {
        accept: "*/*",
        origin: "https://www.donati.it",
        referer: "https://www.donati.it/",
        "user-agent": "Mozilla/5.0"
      }
    });

    if (!res.ok) {
      console.error("Donati API error:", res.status);
      return { results: [], hasMore: false };
    }

    const data = await res.json();

    const results: SupplierResult[] = (data.results || []).map((item: any) => ({
      supplier: "Donati",
      title: item.title || "",
      reference: item.code || item.gtin || item.field_seakey || "",
      image: item.image_link || "",
      link: item.link || "",
      brand: item.brand || "",
      description: item.description || "",
      score: item.dfscore || 0
    }));

    const hasMore = results.length === 30;

    return { results, hasMore };

  } catch (err) {

    console.error("Donati search error:", err);

    return { results: [], hasMore: false };

  }
}