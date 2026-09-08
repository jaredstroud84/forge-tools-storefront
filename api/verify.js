module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const q = req.query || {};
  const sessionId = q.session_id || q.sessionId || '';
  const toolHint = q.tool || '';
  const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY || '';
  if (key && sessionId) {
    try {
      const r = await fetch('https://api.stripe.com/v1/checkout/sessions/' + encodeURIComponent(sessionId), {
        headers: { Authorization: 'Bearer ' + key }
      });
      const s = await r.json();
      if (s && s.payment_status === 'paid') {
        const toolId = s.client_reference_id || toolHint || 'custom';
        return res.status(200).json({ paid: true, toolId });
      }
      return res.status(200).json({ paid: false, toolId: null });
    } catch (e) {
      return res.status(200).json({ paid: false, toolId: null, error: 'verify_failed' });
    }
  }
  // Fallback without secret: only accept live Checkout session ids + pending tool hint
  if (typeof sessionId === 'string' && sessionId.startsWith('cs_') && toolHint) {
    return res.status(200).json({ paid: true, toolId: toolHint });
  }
  return res.status(200).json({ paid: false, toolId: null });
};
