"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeElva = scrapeElva;
async function scrapeElva(query) {
    const url = `https://eu1-search.doofinder.com/5/search?hashid=afe3fca7707fea9e98a7a637e1157e08&page=1&rpp=30&query_counter=1&query_name=match_and&query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results.map((item) => ({
        supplier: "ElvaCenter",
        title: item.title,
        reference: item.oem || item.gtin,
        brand: item.brand,
        price: item.price,
        availability: item.availability,
        url: item.link,
        image: item.image_link
    }));
}
