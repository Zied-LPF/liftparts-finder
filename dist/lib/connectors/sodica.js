"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSodica = fetchSodica;
async function fetchSodica(query) {
    const url = `https://api.sodica.com/search?query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    const results = [];
    if (Array.isArray(data.results)) {
        for (const item of data.results) {
            results.push({
                title: item.title,
                reference: item.ref,
                brand: item.brand || '',
                supplier: 'Sodica',
                link: item.link,
                price: item.price || 0,
                source: 'Sodica'
            });
        }
    }
    return results;
}
