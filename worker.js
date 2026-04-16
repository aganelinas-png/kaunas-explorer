// SpotSeekers — Cloudflare Worker

const GITHUB_HTML_PROD    = 'https://raw.githubusercontent.com/aganelinas-png/kaunas-explorer/main/index.html';
const GITHUB_HTML_STAGING = 'https://raw.githubusercontent.com/aganelinas-png/kaunas-explorer/Staging/index.html';

const FIREBASE_CONFIG_PLACEHOLDER = `const firebaseConfig={
  apiKey:"AIzaSyDTL21A2rzaZrIefNnR5CZikuRakgtM1uE",
  authDomain:"spotseekers.net",
  projectId:"kaunas-explorer",
  storageBucket:"kaunas-explorer.firebasestorage.app",
  messagingSenderId:"241890115444",
  appId:"1:241890115444:web:7d9fa68c8a15e07a20b621"
};`;

const ASSETLINKS = JSON.stringify([{
  relation: ['delegate_permission/common.handle_all_urls'],
  target: {
    namespace: 'android_app',
    package_name: 'com.spotseekers.app',
    sha256_cert_fingerprints: [
      'E0:8D:FB:97:13:CF:98:F1:B2:58:67:67:9C:DF:74:F2:05:49:57:9F:64:0F:77:E5:39:E5:DF:EE:31:29:F1:EA',
      'E7:28:C9:61:E0:A5:E8:12:8F:A7:AF:B3:EA:09:C3:1A:FC:9F:0C:B3:89:03:A9:F5:AE:65:04:30:C9:4E:4E:ED:35'
    ]
  }
}]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isStaging = url.hostname === 'staging.spotseekers.net' || url.hostname.includes('spotseekers-staging');
    const adminSecret = env.ADMIN_SECRET || 'lithuania2026';

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

    // ── GET /api/spots ──
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
      if (secret !== adminSecret) {
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

    // ── Default — serve HTML ──
    const githubUrl = isStaging ? GITHUB_HTML_STAGING : GITHUB_HTML_PROD;

    // Bypass Cloudflare cache for staging so config replacement always works
    const htmlRes = await fetch(githubUrl, {
      cf: isStaging
        ? { cacheEverything: false, cacheTtl: 0 }
        : { cacheTtl: 60, cacheEverything: true }
    });
    let html = await htmlRes.text();

    // Inject correct Firebase config from environment variable
    if (env.FIREBASE_CONFIG) {
      const cfg = JSON.parse(env.FIREBASE_CONFIG);
      const injected = `const firebaseConfig={
  apiKey:"${cfg.apiKey}",
  authDomain:"${cfg.authDomain}",
  projectId:"${cfg.projectId}",
  storageBucket:"${cfg.storageBucket}",
  messagingSenderId:"${cfg.messagingSenderId}",
  appId:"${cfg.appId}"
};`;
      html = html.replace(FIREBASE_CONFIG_PLACEHOLDER, injected);
    }

    const headers = { 'Content-Type': 'text/html;charset=utf-8' };
    if (isStaging) headers['X-Environment'] = 'staging';

    return new Response(html, { headers });
  }
};
