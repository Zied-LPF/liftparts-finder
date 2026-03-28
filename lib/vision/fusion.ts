// lib/vision/fusion.ts
// Architecture multi-modèles — v1 : Gemini seul, prêt pour Claude + GPT-4o en v2

import { analyzeWithGemini } from "./gemini"
import type { VisionAnalysis, VisionModelResult, FusionResult } from "./types"

// ─── V2 : décommenter quand les clés seront disponibles ──────────────────────
// import { analyzeWithClaude } from "./claude"
// import { analyzeWithGPT4o } from "./gpt4o"

export async function analyzeImage(
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<FusionResult> {
  
  const modelResults: VisionModelResult[] = []

  // ── Gemini (actif) ─────────────────────────────────────────────────────────
  const geminiStart = Date.now()
  try {
    const geminiResult = await analyzeWithGemini(imageBase64, mimeType)
    modelResults.push({
      model: "gemini-1.5-pro",
      analysis: geminiResult,
      latencyMs: Date.now() - geminiStart
    })
  } catch (err) {
    modelResults.push({
      model: "gemini-1.5-pro",
      analysis: null,
      error: String(err),
      latencyMs: Date.now() - geminiStart
    })
  }

  // ── V2 : Claude Vision ─────────────────────────────────────────────────────
  // if (process.env.ANTHROPIC_API_KEY) {
  //   const claudeStart = Date.now()
  //   try {
  //     const claudeResult = await analyzeWithClaude(imageBase64, mimeType)
  //     modelResults.push({ model: "claude-3-5-sonnet", analysis: claudeResult, latencyMs: Date.now() - claudeStart })
  //   } catch (err) {
  //     modelResults.push({ model: "claude-3-5-sonnet", analysis: null, error: String(err), latencyMs: Date.now() - claudeStart })
  //   }
  // }

  // ── V2 : GPT-4o Vision ─────────────────────────────────────────────────────
  // if (process.env.OPENAI_API_KEY) {
  //   const gptStart = Date.now()
  //   try {
  //     const gptResult = await analyzeWithGPT4o(imageBase64, mimeType)
  //     modelResults.push({ model: "gpt-4o", analysis: gptResult, latencyMs: Date.now() - gptStart })
  //   } catch (err) {
  //     modelResults.push({ model: "gpt-4o", analysis: null, error: String(err), latencyMs: Date.now() - gptStart })
  //   }
  // }

  // ── Fusion des résultats ───────────────────────────────────────────────────
  const successful = modelResults.filter(r => r.analysis !== null)

  if (successful.length === 0) {
    // Aucun modèle n'a répondu → fallback minimal
    return {
      final: {
        searchQuery: "pièce ascenseur",
        confidence: "low",
        mode: "visual",
        model: "none",
        partType: "pièce ascenseur"
      },
      modelResults,
      consensusScore: 0
    }
  }

  if (successful.length === 1) {
    // Un seul modèle → utiliser directement
    return {
      final: successful[0].analysis!,
      modelResults,
      consensusScore: 0.6  // Confiance modérée avec 1 seul modèle
    }
  }

  // ── Multi-modèles : algorithme de consensus ────────────────────────────────
  // (activé en v2 quand plusieurs modèles disponibles)
  const analyses = successful.map(r => r.analysis!)
  
  // Consensus sur la référence (vote majoritaire)
  const refCounts = new Map<string, number>()
  analyses.forEach(a => {
    if (a.reference) {
      const normalized = a.reference.replace(/\s/g, "").toUpperCase()
      refCounts.set(normalized, (refCounts.get(normalized) || 0) + 1)
    }
  })
  
  let consensusRef: string | undefined
  let maxRefVotes = 0
  refCounts.forEach((count, ref) => {
    if (count > maxRefVotes) { maxRefVotes = count; consensusRef = ref }
  })

  // Consensus sur la marque
  const brandCounts = new Map<string, number>()
  analyses.forEach(a => {
    if (a.brand) {
      const normalized = a.brand.toUpperCase()
      brandCounts.set(normalized, (brandCounts.get(normalized) || 0) + 1)
    }
  })
  
  let consensusBrand: string | undefined
  let maxBrandVotes = 0
  brandCounts.forEach((count, brand) => {
    if (count > maxBrandVotes) { maxBrandVotes = count; consensusBrand = brand }
  })

  // Score de consensus (% de modèles en accord)
  const totalModels = successful.length
  const refConsensus = consensusRef ? maxRefVotes / totalModels : 0
  const brandConsensus = consensusBrand ? maxBrandVotes / totalModels : 0
  const consensusScore = (refConsensus + brandConsensus) / 2

  // Prendre le premier résultat comme base et enrichir avec le consensus
  const base = analyses[0]
  const fused: VisionAnalysis = {
    ...base,
    reference: consensusRef || base.reference,
    brand: consensusBrand || base.brand,
    // Construire la requête optimisée avec les données consensus
    searchQuery: buildOptimalQuery(consensusRef, consensusBrand, base),
    confidence: consensusScore > 0.7 ? "high" : consensusScore > 0.4 ? "medium" : "low",
    model: successful.map(r => r.model).join("+")
  }

  return { final: fused, modelResults, consensusScore }
}

function buildOptimalQuery(
  ref: string | undefined,
  brand: string | undefined,
  base: VisionAnalysis
): string {
  if (ref && brand) return `${brand} ${ref}`.trim()
  if (ref) return ref
  if (brand && base.partType) return `${brand} ${base.partType}`.trim()
  return base.searchQuery || base.partType || "pièce ascenseur"
}
