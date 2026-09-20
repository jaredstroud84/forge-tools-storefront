module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ text: null, source: 'local' });
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch (_) { body = {}; }
  }
  body = body || {};
  const tool = String(body.tool || 'custom').slice(0, 40);
  const dump = String(body.dump || '').slice(0, 6000);
  const full = !!body.full;
  const xai = process.env.XAI_API_KEY || process.env.GROK_API_KEY || '';
  const ant = process.env.ANTHROPIC_API_KEY || '';
  const sys = 'Write only the finished document the person can send or follow today. Use their facts. No marketing. No chatbot filler.';
  const user = 'Solution: ' + tool + '\nFacts:\n' + dump + '\nLength: ' + (full ? 'full page' : 'short first page only');
  try {
    if (xai) {
      const r = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + xai },
        body: JSON.stringify({
          model: process.env.XAI_MODEL || 'grok-4-fast',
          temperature: 0.2,
          max_tokens: full ? 900 : 280,
          messages: [{ role: 'system', content: sys }, { role: 'user', content: user }]
        })
      });
      const j = await r.json();
      const text = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
      if (text) return res.status(200).json({ text: String(text), source: 'xai' });
    }
    if (ant) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': ant, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: full ? 900 : 280,
          system: sys,
          messages: [{ role: 'user', content: user }]
        })
      });
      const j = await r.json();
      const text = j && j.content && j.content[0] && j.content[0].text;
      if (text) return res.status(200).json({ text: String(text), source: 'anthropic' });
    }
  } catch (_) {}
  return res.status(200).json({ text: null, source: 'local' });
};
