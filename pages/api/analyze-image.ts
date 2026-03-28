// pages/api/analyze-image.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { analyzeImage } from "../../lib/vision/fusion"
import type { FusionResult } from "../../lib/vision/types"

// Désactiver le bodyParser par défaut pour recevoir le base64
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"  // Images jusqu'à 10MB
    }
  }
}

type SuccessResponse = {
  analysis: FusionResult["final"]
  searchQuery: string
  models: string[]
  consensusScore: number
  latencyMs: number
}

type ErrorResponse = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const start = Date.now()

  // Vérification auth cookie
  const authCookie = req.cookies["lpf_auth"]
  if (authCookie !== "1") {
    return res.status(401).json({ error: "Non autorisé" })
  }

  const { imageBase64, mimeType } = req.body

  if (!imageBase64) {
    return res.status(400).json({ error: "Image manquante" })
  }

  // Validation du type MIME
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
  const resolvedMime = mimeType || "image/jpeg"
  if (!allowedTypes.includes(resolvedMime)) {
    return res.status(400).json({ error: "Format d'image non supporté" })
  }

  try {
    const result = await analyzeImage(imageBase64, resolvedMime)
    const latencyMs = Date.now() - start

    console.log("Vision analysis result:", {
      query: result.final.searchQuery,
      confidence: result.final.confidence,
      mode: result.final.mode,
      models: result.modelResults.map(m => m.model),
      latencyMs
    })

    return res.status(200).json({
      analysis: result.final,
      searchQuery: result.final.searchQuery,
      models: result.modelResults.filter(m => m.analysis).map(m => m.model),
      consensusScore: result.consensusScore,
      latencyMs
    })
  } catch (err: any) {
    console.error("analyze-image error:", err)
    return res.status(500).json({ error: "Erreur lors de l'analyse de l'image" })
  }
}
