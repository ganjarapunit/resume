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
      'Access-Control-Allow-Headers': 'Content-Type, X-Experience-API-Version, Authorization',
      'Access-Control-Max-Age': '86400'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const url = new URL(request.url);
    if (!url.pathname.endsWith('/statements')) {
      return new Response(JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const auth = 'Basic ' + btoa(env.LRS_KEY + ':' + env.LRS_SECRET);
    const upstream = 'https://game.lrs.io/xapi/statements' + (url.search || '');

    try {
      const res = await fetch(upstream, {
        method: 'POST',
        headers: {
          'Authorization': auth,
          'Content-Type': request.headers.get('Content-Type') || 'application/json',
          'X-Experience-API-Version': '1.0.3',
          'Accept': 'application/json'
        },
        body: request.body
      });
      const txt = await res.text();
      return new Response(txt, {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': res.headers.get('Content-Type') || 'application/json' }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Upstream LRS error' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  }
};
