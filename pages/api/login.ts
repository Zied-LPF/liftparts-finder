import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { password } = req.body

  if (password === process.env.LOGIN_PASSWORD) {
    // 🔹 Cookie accessible côté client (pas HttpOnly)
    res.setHeader(
      'Set-Cookie',
      'lpf_auth=1; Path=/; Max-Age=86400; SameSite=Lax'
    )
    return res.status(200).json({ success: true })
  }

  return res.status(401).json({ error: 'Invalid password' })
}