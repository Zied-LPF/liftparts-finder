"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeDoofinder = scrapeDoofinder;
const HASHID = process.env.NEXT_PUBLIC_DOOFINDER_HASHID;
const API_KEY = process.env.NEXT_PUBLIC_DOOFINDER_API_KEY;
async function scrapeDoofinder(query) {
    const url = `https://apiv2.doofinder.com/search/${HASHID}/query/${encodeURIComponent(query)}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const results = [];
    if (Array.isArray(data.records)) {
        for (const r of data.records) {
            results.push({
                title: r.title,
                reference: r.reference || r.title,
                brand: r.brand || '',
                supplier: r.supplier || 'Doofinder',
                link: r.url,
                price: r.price || 0,
                source: 'Doofinder'
            });
        }
    }
    return results;
}
