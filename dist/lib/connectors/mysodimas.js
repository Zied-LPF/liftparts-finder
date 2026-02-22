"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMySodimas = fetchMySodimas;
async function fetchMySodimas(query) {
    const url = `https://www.mysodimas.com/search?query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    const results = [];
    if (Array.isArray(data.items)) {
        for (const item of data.items) {
            results.push({
                title: item.title,
                reference: item.reference,
                brand: item.brand || '',
                supplier: 'MySodimas',
                link: item.url,
                price: item.price || 0,
                source: 'MySodimas'
            });
        }
    }
    return results;
}
