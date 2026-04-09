// Lithuania Explorer — Cloudflare Worker
// Serves the app + spots from KV cache

import html from './index.html';

// Hardcoded admin secret — change this to something only you know
const ADMIN_SECRET = 'lithuania2026';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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

    // ── POST /api/admin/rebuild — admin writes fresh spots JSON to KV ──
    if (url.pathname === '/api/admin/rebuild' && request.method === 'POST') {
      const secret = request.headers.get('X-Admin-Secret');
      if (secret !== ADMIN_SECRET) {
        return new Response('Forbidden', { status: 403 });
      }
      try {
        const body = await request.text();
        // Validate it's real JSON array before storing
        const parsed = JSON.parse(body);
        if (!Array.isArray(parsed)) throw new Error('Expected array');
        await env.SPOTS_KV.put('spots_v1', body);
        return new Response(JSON.stringify({ ok: true, count: parsed.length }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch(e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // ── GET /api/spots/status — check cache status (admin only) ──
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

    // ── Default — serve the app HTML ──
    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=utf-8' }
    });
  }
};
