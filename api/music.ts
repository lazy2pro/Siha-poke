const prompts = [
  'Bright playful instrumental for a children’s historical adventure in Joseon Korea. Gentle gayageum-like plucks, marimba, hand claps, sunny major key, no vocals, no lyrics, calm exploration game loop.',
  'Bright playful instrumental for a children’s adventure in the Three Kingdoms era of Korea. Light wooden flute, bells, hand percussion, sunny major key, no vocals, no lyrics, calm exploration game loop.',
  'Cheerful instrumental for a children’s Goryeo celadon treasure adventure. Sparkling mallets, soft strings, breezy rhythm, sunny major key, no vocals, no lyrics, calm exploration game loop.',
  'Energetic but gentle instrumental for a children’s turtle ship adventure. Warm drums, playful flute, marimba, sunny major key, no vocals, no lyrics, calm exploration game loop.',
  'Hopeful bright instrumental for a children’s modern Korea time adventure. Piano, marimba, light pop percussion, sunny major key, no vocals, no lyrics, calm exploration game loop.',
]

export default async function handler(req: any, res: any) {
  const stage = Math.max(1, Math.min(5, Number(req.query?.stage) || 1))
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Gemini music service is not configured' })
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'lyria-3-clip-preview', input: prompts[stage - 1] }),
    })
    if (!response.ok) { const detail = await response.text(); console.warn('Gemini music failed', response.status, detail.slice(0, 500)); return res.status(response.status).json({ error: 'Gemini music generation failed' }) }
    const payload = await response.json()
    const audio = payload?.steps?.flatMap((step: any) => step.content || []).find((item: any) => item.type === 'audio' && item.data)?.data
    if (!audio) return res.status(502).json({ error: 'Gemini returned no music' })
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')
    return res.send(Buffer.from(audio, 'base64'))
  } catch (error) { console.warn('Gemini music request failed', error); return res.status(502).json({ error: 'Gemini music request failed' }) }
}
