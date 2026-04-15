// Lithuania Explorer — Cloudflare Worker
// Serves index.html directly from GitHub — upload index.html to GitHub to deploy

const GITHUB_HTML = 'https://raw.githubusercontent.com/aganelinas-png/kaunas-explorer/main/index.html';
const ADMIN_SECRET = 'lithuania2026';

const ASSETLINKS = JSON.stringify([{
  relation: ['delegate_permission/common.handle_all_urls'],
  target: {
    namespace: 'android_app',
    package_name: 'net.spotseekers.app',
    sha256_cert_fingerprints: [
      'E0:8D:FB:97:13:CF:98:F1:B2:58:67:67:9C:DF:74:F2:05:49:57:9F:64:0F:77:E5:39:E5:DF:EE:31:29:F1:EA'
    ]
  }
}]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ── GET /.well-known/assetlinks.json — TWA verification ──
    if (url.pathname === '/.well-known/assetlinks.json') {
      return new Response(ASSETLINKS, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        }
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
