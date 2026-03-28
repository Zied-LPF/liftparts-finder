// lib/vision/types.ts

export type VisionAnalysis = {
  // Identification principale
  reference?: string          // Référence produit (ex: GAA621BV1, SP0297, TMS03)
  referenceSecondary?: string // Référence secondaire (numéro de série, code)
  brand?: string              // Marque (OTIS, KONE, Schindler, Sodimas...)
  partType?: string           // Type de pièce (capteur, carte électronique, galet...)
  
  // Description visuelle détaillée
  visualDescription?: string  // Description complète pour comparaison visuelle
  colors?: string[]           // Couleurs dominantes
  shape?: string              // Forme globale
  components?: string[]       // Composants identifiés (pour PCB)
  
  // Requête optimisée pour la recherche
  searchQuery: string         // Requête prête à envoyer aux fournisseurs
  searchQueryAlt?: string     // Requête alternative si la première échoue
  
  // Métadonnées
  confidence: "high" | "medium" | "low"  // Niveau de confiance
  mode: "reference" | "visual"           // Mode de recherche recommandé
  model: string                          // Modèle IA utilisé
  rawResponse?: string                   // Réponse brute pour debug
}

export type VisionModelResult = {
  model: string
  analysis: VisionAnalysis | null
  error?: string
  latencyMs: number
}

export type FusionResult = {
  final: VisionAnalysis
  modelResults: VisionModelResult[]
  consensusScore: number  // 0-1, score de consensus entre modèles
}
