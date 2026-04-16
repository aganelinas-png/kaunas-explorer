// SpotSeekers — Cloudflare Worker

const GITHUB_HTML_PROD    = 'https://raw.githubusercontent.com/aganelinas-png/kaunas-explorer/main/index.html';
const GITHUB_HTML_STAGING = 'https://raw.githubusercontent.com/aganelinas-png/kaunas-explorer/staging/index.html';

const PROD_FIREBASE_CONFIG = `const firebaseConfig={
  apiKey:"AIzaSyDTL21A2rzaZrIefNnR5CZikuRakgtM1uE",
  authDomain:"kaunas-explorer.firebaseapp.com",
  projectId:"kaunas-explorer",
  storageBucket:"kaunas-explorer.firebasestorage.app",
  messagingSenderId:"241890115444",
  appId:"1:241890115444:web:7d9fa68c8a15e07a20b621"};`;

const STAGING_FIREBASE_CONFIG = `const firebaseConfig={
  apiKey:"AIzaSyA4PRIncl2ALST-eU5X1ezIpSYTlLbFYaA",
  authDomain:"spotseekers-staging.firebaseapp.com",
  projectId:"spotseekers-staging",
  storageBucket:"spotseekers-staging.firebasestorage.app",
  messagingSenderId:"284211079370",
  appId:"1:284211079370:web:faf7ccbb9b1cd8ce33ac33"};`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const isStaging = url.hostname === 'staging.spotseekers.net';
    const adminSecret = env.ADMIN_SECRET || 'lithuania2026';

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
    const htmlRes = await fetch(githubUrl, {
      cf: { cacheTtl: 60, cacheEverything: true }
    });
    let html = await htmlRes.text();

    // Inject correct Firebase config
    if (isStaging) {
      html = html.replace(PROD_FIREBASE_CONFIG, STAGING_FIREBASE_CONFIG);
    }

    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=utf-8' }
    });
  }
};
