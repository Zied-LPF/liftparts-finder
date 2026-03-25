// pages/api/hissmekano-image.ts
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).end("Missing id")
  }

  try {
    const imageRes = await fetch(
      `https://api.hissmekano.se/v2/product/get-asset-file?id=${id}`,
      {
        headers: {
          "accept": "image/*,*/*",
          "origin": "https://hissmekano.com",
          "referer": "https://hissmekano.com/",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      }
    )

    if (!imageRes.ok) {
      return res.status(imageRes.status).end("Image not found")
    }

    const contentType = imageRes.headers.get("content-type") || "image/jpeg"
    const buffer = await imageRes.arrayBuffer()

    console.log("Image API status:", imageRes.status)
    console.log("Image API body:", await imageRes.text())

    res.setHeader("Content-Type", contentType)
    res.setHeader("Cache-Control", "public, max-age=86400") // cache 24h
    res.status(200).send(Buffer.from(buffer))

  } catch (err) {
    console.error("Hissmekano image proxy error:", err)
    res.status(500).end("Error fetching image")
  }
}
