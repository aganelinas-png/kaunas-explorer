// Lithuania Explorer — Cloudflare Worker
// Serves index.html directly from GitHub — upload index.html to GitHub to deploy

const GITHUB_HTML = 'https://raw.githubusercontent.com/aganelinas-png/kaunas-explorer/main/index.html';
const ADMIN_SECRET = 'lithuania2026';

// Map country code → KV key
function spotsKvKey(country) {
  if (country === 'PL') return 'spots_pl_v1';
  return 'spots_lt_v1'; // default / LT
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ── GET /api/spots?country=LT|PL ──
    if (url.pathname === '/api/spots') {
      const country = url.searchParams.get('country') || 'LT';
      const kvKey = spotsKvKey(country);
      const spots = await env.SPOTS_KV.get(kvKey);
      if (!spots) {
        return new Response(JSON.stringify({error:'Cache empty — rebuild needed'}), {
          status: 503,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      return new Response(spots, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // ── POST /api/admin/rebuild?country=LT|PL ──
    if (url.pathname === '/api/admin/rebuild' && request.method === 'POST') {
      const secret = request.headers.get('X-Admin-Secret');
      if (secret !== ADMIN_SECRET) {
        return new Response('Forbidden', { status: 403 });
      }
      try {
        const country = url.searchParams.get('country') || 'LT';
        const kvKey = spotsKvKey(country);
        const body = await request.text();
        const parsed = JSON.parse(body);
        if (!Array.isArray(parsed)) throw new Error('Expected array');
        await env.SPOTS_KV.put(kvKey, body);
        return new Response(JSON.stringify({ ok: true, count: parsed.length, country, kvKey }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 400, headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // ── GET /api/spots/status ──
    if (url.pathname === '/api/spots/status') {
      const country = url.searchParams.get('country') || 'LT';
      const kvKey = spotsKvKey(country);
      const spots = await env.SPOTS_KV.get(kvKey);
      if (!spots) return new Response(JSON.stringify({ cached: false, country, kvKey }), {
        headers: { 'Content-Type': 'application/json' }
      });
      const arr = JSON.parse(spots);
      return new Response(JSON.stringify({ cached: true, count: arr.length, country, kvKey }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ── GET /api/zabytek — CORS proxy to Polish heritage registry ──
    if (url.pathname === '/api/zabytek') {
      const secret = request.headers.get('X-Admin-Secret');
      if (secret !== ADMIN_SECRET) {
        return new Response('Forbidden', { status: 403 });
      }
      const zabyUrl = new URL('https://api.zabytek.gov.pl/nidrestapi/api/data/geoportal/otwarteDaneZestawienieZrn');
      for (const [k, v] of url.searchParams) zabyUrl.searchParams.set(k, v);
      try {
        const res = await fetch(zabyUrl.toString(), {
          headers: { 'Accept': 'application/json' }
        });
        const body = await res.text();
        return new Response(body, {
          status: res.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // ── Default — fetch index.html from GitHub ──
    const htmlRes = await fetch(GITHUB_HTML, {
      cf: { cacheTtl: 60, cacheEverything: true }
    });
    const html = await htmlRes.text();
    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=utf-8' }
    });
  }
};

