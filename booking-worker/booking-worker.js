export default {
  async fetch(request, env) {
    const allowedOrigins = [
      'https://punitganjara.com',
      'https://www.punitganjara.com',
      'https://ganjarapunit.github.io'
    ];
    const origin = request.headers.get('Origin');
    const allowOrigin = allowedOrigins.includes(origin) ? origin : 'https://punitganjara.com';
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let data;
    try {
      data = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const date = String(data.date || '').trim();
    const time = String(data.time || '').trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || !date || !time) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing or invalid fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const text = 'New trial lesson request\n\n'
      + 'Name: ' + name + '\n'
      + 'Email: ' + email + '\n'
      + 'Preferred date: ' + date + '\n'
      + 'Preferred time: ' + time;
    const html = '<h2>New trial lesson request</h2>'
      + '<p><strong>Name:</strong> ' + escapeHtml(name) + '<br>'
      + '<strong>Email:</strong> ' + escapeHtml(email) + '<br>'
      + '<strong>Preferred date:</strong> ' + escapeHtml(date) + '<br>'
      + '<strong>Preferred time:</strong> ' + escapeHtml(time) + '</p>';

    try {
      const r = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Trial Lesson Booking', email: 'punit@punitganjara.com' },
          to: [{ email: 'punit@punitganjara.com' }],
          replyTo: { email: email, name: name },
          subject: 'New trial lesson request from ' + name,
          textContent: text,
          htmlContent: html
        })
      });
      if (!r.ok) {
        const detail = await r.text();
        return new Response(JSON.stringify({ ok: false, error: 'Email send failed', detail }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: 'Email send error' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
