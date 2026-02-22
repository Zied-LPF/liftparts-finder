"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scorePart = scorePart;
function scorePart(part, query) {
    const q = query.toLowerCase();
    let score = 0;
    if (part.title?.toLowerCase().includes(q))
        score += 10;
    if (part.reference?.toLowerCase().includes(q))
        score += 8;
    if (part.brand?.toLowerCase().includes(q))
        score += 5;
    if (part.supplier?.toLowerCase().includes(q))
        score += 3;
    // boost favoris
    if (part.source === "Supabase" && part.supplier === "MySodimas")
        score += 3;
    return score;
}
