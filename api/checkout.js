module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  var toolId = 'games';
  try {
    var body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (body && body.toolId) toolId = String(body.toolId).slice(0, 80);
  } catch (e) {}
  var q = req.query || {};
  if (q.toolId) toolId = String(q.toolId).slice(0, 80);
  var origin = 'https://forge-tools-two-three.vercel.app';
  var key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY || '';
  if (key) {
    var params = new URLSearchParams();
    params.set('mode', 'payment');
    params.set('success_url', origin + '/play/?checkout=success&session_id={CHECKOUT_SESSION_ID}&tool=' + encodeURIComponent(toolId));
    params.set('cancel_url', origin + '/play/?checkout=cancel&tool=' + encodeURIComponent(toolId));
    params.set('client_reference_id', toolId);
    params.set('line_items[0][quantity]', '1');
    params.set('line_items[0][price_data][currency]', 'usd');
    params.set('line_items[0][price_data][unit_amount]', '499');
    params.set('line_items[0][price_data][product_data][name]', 'Forge pack');
    params.set('line_items[0][price_data][product_data][description]', 'One-time. No subscription.');
    try {
      var r = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
      var s = await r.json();
      if (s && s.url) return res.status(200).json({ url: s.url, mode: 'session', id: s.id });
      return res.status(200).json({ url: fallback(toolId), mode: 'link', error: s && s.error ? s.error.message : 'session_failed' });
    } catch (err) {
      return res.status(200).json({ url: fallback(toolId), mode: 'link', error: 'session_failed' });
    }
  }
  return res.status(200).json({ url: fallback(toolId), mode: 'link' });
  function fallback(id) {
    return 'https://buy.stripe.com/00w14p7JK1XDa4CbNEbsc02?client_reference_id=' + encodeURIComponent(id);
  }
};
