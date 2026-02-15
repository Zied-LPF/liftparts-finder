import type { NextApiRequest, NextApiResponse } from 'next'
import { createWorker } from 'tesseract.js'
import formidable from 'formidable'
import fs from 'fs'

export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const form = new formidable.IncomingForm({ keepExtensions: true })
  form.uploadDir = './uploads'

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' })
    const file = files.image as any
    if (!file) return res.status(400).json({ error: 'No file uploaded' })

    const filePath = file.filepath || file.path
    const worker = createWorker()

    await worker.load()
    await worker.loadLanguage('fra+eng')
    await worker.initialize('fra+eng')

    const { data: { text } } = await worker.recognize(filePath)
    await worker.terminate()

    const query = text.trim()
    if (!query) return res.status(400).json({ error: 'No text detected in image' })

    const searchRes = await fetch(`http://localhost:3000/api/search-suppliers?q=${encodeURIComponent(query)}`)
    const results = await searchRes.json()

    fs.unlinkSync(filePath)
    return res.status(200).json({ query, results })
  })
}
