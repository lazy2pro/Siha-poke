export default async function handler(req: any, res: any) {
  const text = typeof req.query?.text === 'string' ? req.query.text.slice(0, 300) : ''
  const voice = typeof req.query?.voice === 'string' ? req.query.voice : 'coral'

  if (!text) return res.status(400).json({ error: 'text is required' })
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'voice service is not configured' })

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice,
      input: text,
      response_format: 'mp3',
      instructions: 'Speak Korean naturally like a warm, playful game companion. Keep phrases short, lively, and conversational. Never sound like a formal narrator.',
    }),
  })

  if (!response.ok) return res.status(response.status).json({ error: 'voice generation failed' })
  res.setHeader('Content-Type', 'audio/mpeg')
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800')
  res.send(Buffer.from(await response.arrayBuffer()))
}
