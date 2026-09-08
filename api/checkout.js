module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  let toolId = 'forge';
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (body && body.toolId) toolId = String(body.toolId).slice(0, 80);
  } catch (_) {}
  const q = req.query || {};
  if (q.toolId) toolId = String(q.toolId).slice(0, 80);
  const url = 'https://buy.stripe.com/00w14p7JK1XDa4CbNEbsc02?client_reference_id=' + encodeURIComponent(toolId);
  return res.status(200).json({ url, mode: 'link' });
};
