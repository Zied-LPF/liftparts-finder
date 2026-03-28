// lib/vision/gemini.ts
import type { VisionAnalysis } from "./types"

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"

const SYSTEM_PROMPT = `Tu es un expert en pièces détachées pour ascenseurs et équipements de levage.
Analyse l'image fournie et extrais les informations suivantes en JSON strict.

RÈGLES D'EXTRACTION :

1. RÉFÉRENCE PRODUIT :
   - Sur étiquette collée : lire le champ "Type:", "Ref:", "Part No:", "Réf:" ou le numéro principal
   - Sur boîtier électronique : lire le champ "Type:" comme référence principale
   - Sur PCB/carte électronique : lire UNIQUEMENT le texte sérigraphié sur les BORDS de la carte (haut/bas/côtés), JAMAIS les références sur les puces ou composants individuels
   - Sur pièce mécanique sans étiquette : ne pas inventer de référence
   - Si plusieurs numéros visibles sur PCB : prendre celui sur le bord, ignorer ceux sur les puces

2. MARQUE :
   - Lire le nom de marque sur l'étiquette ou gravé/moulé sur la pièce
   - Ignorer les watermarks/logos de fournisseurs revendeurs (Donati, Sodimas, Hauer, etc.) — ce sont des revendeurs, pas des fabricants
   - Marques ascenseur connues : OTIS, KONE, Schindler, ThyssenKrupp, Mitsubishi, Fujitec, Sodimas, Dynatech, Memco, Fermator, BEA, Wittur

3. TYPE DE PIÈCE (obligatoire même sans référence) :
   Exemples : "carte électronique", "capteur magnétique", "galet de guidage", "serrure de porte palière", "bouton d'appel", "moteur", "variateur", "boîtier électronique", "câble", "rail de guidage", "détecteur"

4. DESCRIPTION VISUELLE (pour comparaison si pas de référence) :
   - Forme globale de la pièce
   - Matériaux et couleurs (ex: "boîtier bleu rectangulaire", "roue caoutchouc noir + axe acier")
   - Pour PCB : couleur du PCB, type de connecteurs, disposition des composants principaux, couleurs des borniers
   - Pour pièce mécanique : forme, dimensions relatives, matériaux
   - Position et caractéristiques des éléments distinctifs

5. REQUÊTE DE RECHERCHE OPTIMISÉE :
   - Si référence connue : "MARQUE RÉFÉRENCE" (ex: "OTIS GAA621BV1")
   - Si référence partielle : inclure la référence + type de pièce
   - Si pas de référence : description concise du type + caractéristiques visuelles clés
   - Maximum 6 mots, termes techniques ascenseur

6. MULTI-PIÈCES :
   - Si plusieurs pièces visibles, analyser la pièce PRINCIPALE (la plus grande/centrale)
   - Mentionner les pièces secondaires dans la description visuelle

Réponds UNIQUEMENT avec ce JSON (aucun texte avant ou après) :
{
  "reference": "string ou null",
  "referenceSecondary": "string ou null",
  "brand": "string ou null",
  "partType": "string",
  "visualDescription": "string",
  "colors": ["couleur1", "couleur2"],
  "shape": "string",
  "components": ["composant1", "composant2"],
  "searchQuery": "string",
  "searchQueryAlt": "string ou null",
  "confidence": "high|medium|low",
  "mode": "reference|visual"
}`

export async function analyzeWithGemini(
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<VisionAnalysis | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    console.error("GOOGLE_AI_API_KEY manquante")
    return null
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,      // Très bas pour maximiser la précision
          topP: 0.8,
          maxOutputTokens: 1024,
        }
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Gemini API error:", response.status, err)
      return null
    }

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // Nettoyer la réponse (supprimer éventuels backticks markdown)
    const cleaned = rawText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim()

    const parsed = JSON.parse(cleaned)

    return {
      reference: parsed.reference || undefined,
      referenceSecondary: parsed.referenceSecondary || undefined,
      brand: parsed.brand || undefined,
      partType: parsed.partType || "pièce ascenseur",
      visualDescription: parsed.visualDescription || "",
      colors: parsed.colors || [],
      shape: parsed.shape || "",
      components: parsed.components || [],
      searchQuery: parsed.searchQuery || parsed.partType || "pièce ascenseur",
      searchQueryAlt: parsed.searchQueryAlt || undefined,
      confidence: parsed.confidence || "low",
      mode: parsed.mode || "visual",
      model: "gemini-1.5-pro",
      rawResponse: rawText
    }
  } catch (err) {
    console.error("Gemini analysis error:", err)
    return null
  }
}
