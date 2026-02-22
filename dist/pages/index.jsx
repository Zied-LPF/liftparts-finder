"use strict";
// pages/index.tsx
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const Search_1 = __importDefault(require("../components/Search"));
function Home() {
    return (<main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>LiftParts Finder</h1>
      <p>Rechercher des pièces par référence, marque ou fournisseur.</p>

      <Search_1.default />
    </main>);
}
