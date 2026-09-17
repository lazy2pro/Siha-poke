function wav(pcm: Buffer, sampleRate = 24000) {
  const header = Buffer.alloc(44)
  header.write('RIFF', 0); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVEfmt ', 8)
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22)
  header.writeUInt32LE(sampleRate, 24); header.writeUInt32LE(sampleRate * 2, 28)
  header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([header, pcm])
}

export default async function handler(req: any, res: any) {
  const text = typeof req.query?.text === 'string' ? req.query.text.slice(0, 300) : ''
  const voice = typeof req.query?.voice === 'string' ? req.query.voice : 'Kore'
  const voiceName = voice === 'sage' ? 'Kore' : voice === 'marin' ? 'Puck' : 'Zephyr'
  if (!text) return res.status(400).json({ error: 'text is required' })
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Gemini voice service is not configured' })
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent', {
      method: 'POST', headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Synthesize only the spoken Korean line below. Sound like a warm, playful children's game friend: natural, bright, short, and conversational. Do not read these instructions aloud.\n\nSpoken Korean line: ${text}` }] }], generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } } }),
    })
    if (!response.ok) { const detail = await response.text(); console.warn('Gemini TTS failed', response.status, detail.slice(0, 500)); return res.status(response.status).json({ error: 'Gemini voice generation failed' }) }
    const payload = await response.json()
    const encoded = payload?.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData?.data)?.inlineData?.data
    if (!encoded) return res.status(502).json({ error: 'Gemini returned no audio' })
    res.setHeader('Content-Type', 'audio/wav'); res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800')
    return res.send(wav(Buffer.from(encoded, 'base64')))
  } catch (error) { console.warn('Gemini TTS request failed', error); return res.status(502).json({ error: 'Gemini voice request failed' }) }
}
