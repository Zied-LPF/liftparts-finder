"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeMgti = scrapeMgti;
const cheerio = __importStar(require("cheerio"));
async function scrapeMgti(query) {
    const url = `https://www.mgti.fr/PBSearch.asp?ActionID=1&CCode=2&ShowSMImg=1&SearchText=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];
    $('table.tbsearchresults tr').each((_, tr) => {
        const link = $(tr).find('td a').attr('href');
        const title = $(tr).find('td a').text().trim();
        const ref = $(tr).find('td:nth-child(2)').text().trim();
        if (link)
            results.push({
                title,
                reference: ref,
                brand: '',
                supplier: 'MGTI',
                link,
                source: 'MGTI'
            });
    });
    return results;
}
