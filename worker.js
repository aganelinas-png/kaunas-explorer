// Lithuania Explorer — Cloudflare Worker
// Serves index.html directly from GitHub — upload index.html to GitHub to deploy

const GITHUB_HTML = 'https://raw.githubusercontent.com/aganelinas-png/kaunas-explorer/main/index.html';
const ADMIN_SECRET = 'lithuania2026';
const FIREBASE_AUTH_ORIGIN = 'https://kaunas-explorer.firebaseapp.com';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ── Firebase Auth proxy — /__/auth/* must be served from spotseekers.net ──
    // This enables signInWithRedirect to work correctly in TWA
    if (url.pathname.startsWith('/__/auth/')) {
      const targetUrl = FIREBASE_AUTH_ORIGIN + url.pathname + url.search;
      const proxyReq = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
        redirect: 'follow',
      });
      const resp = await fetch(proxyReq);
      // Forward response with CORS headers
      const newHeaders = new Headers(resp.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      return new Response(resp.body, {
        status: resp.status,
        headers: newHeaders,
      });
    }

    // ── GET /api/spots — serve cached spots from KV ──
    if (url.pathname === '/api/spots') {
      const spots = await env.SPOTS_KV.get('spots_v1');
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

    // ── POST /api/admin/rebuild ──
    if (url.pathname === '/api/admin/rebuild' && request.method === 'POST') {
      const secret = request.headers.get('X-Admin-Secret');
      if (secret !== ADMIN_SECRET) {
        return new Response('Forbidden', { status: 403 });
      }
      try {
        const body = await request.text();
        const parsed = JSON.parse(body);
        if (!Array.isArray(parsed)) throw new Error('Expected array');
        await env.SPOTS_KV.put('spots_v1', body);
        return new Response(JSON.stringify({ ok: true, count: parsed.length }), {
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
      const spots = await env.SPOTS_KV.get('spots_v1');
      if (!spots) return new Response(JSON.stringify({ cached: false }), {
        headers: { 'Content-Type': 'application/json' }
      });
      const arr = JSON.parse(spots);
      return new Response(JSON.stringify({ cached: true, count: arr.length }), {
        headers: { 'Content-Type': 'application/json' }
      });
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
