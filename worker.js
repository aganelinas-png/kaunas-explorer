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

const PRIVACY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Privacy Policy — SpotSeekers</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#0e0c09;color:#e8e0d0;padding:40px 20px;line-height:1.7}
  .wrap{max-width:720px;margin:0 auto}
  h1{font-size:1.8rem;color:#c9a84c;margin-bottom:6px}
  h2{font-size:1.1rem;color:#c9a84c;margin:28px 0 8px}
  p,li{font-size:.95rem;color:#c0b8a8;margin-bottom:8px}
  ul{padding-left:20px;margin-bottom:8px}
  .updated{font-size:.8rem;color:#6a6050;margin-bottom:32px}
  .lang-switch{display:flex;gap:12px;margin-bottom:32px}
  .lang-btn{background:#1a1710;border:1px solid #2e2a20;color:#c9a84c;padding:6px 16px;border-radius:20px;cursor:pointer;font-size:.85rem}
  .lang-btn.active{background:#c9a84c;color:#0e0c09}
  .section{display:none}.section.active{display:block}
  a{color:#c9a84c}
  hr{border:none;border-top:1px solid #2e2a20;margin:32px 0}
  .footer{font-size:.75rem;color:#4a4538;text-align:center;margin-top:32px}
</style>
</head>
<body>
<div class="wrap">
  <h1>🗺 SpotSeekers</h1>
  <div class="updated">Privacy Policy · Last updated: April 2026</div>

  <div class="lang-switch">
    <button class="lang-btn active" onclick="switchLang('en',this)">English</button>
    <button class="lang-btn" onclick="switchLang('lt',this)">Lietuviškai</button>
  </div>

  <!-- ENGLISH -->
  <div class="section active" id="sec-en">
    <h2>1. Who We Are</h2>
    <p>SpotSeekers is a location discovery and gamification app for Lithuania, developed by an independent developer. Our website is <a href="https://www.spotseekers.net">www.spotseekers.net</a>.</p>

    <h2>2. What We Collect</h2>
    <ul>
      <li><strong>Email address</strong> — used for account login only</li>
      <li><strong>Username</strong> — chosen by you, displayed on the public leaderboard</li>
      <li><strong>Game progress</strong> — found spots, XP points, streaks, badges — saved to our database so your progress is preserved across devices</li>
      <li><strong>Location (GPS)</strong> — accessed only when you tap "Check in" to verify you are physically near a spot. Your location is <strong>never stored or shared</strong></li>
    </ul>

    <h2>3. What We Do NOT Collect</h2>
    <ul>
      <li>We do not sell your data to anyone</li>
      <li>We do not use your data for advertising</li>
      <li>We do not track your location in the background</li>
      <li>We do not collect payment information</li>
      <li>We do not collect device identifiers beyond what Firebase requires</li>
    </ul>

    <h2>4. Leaderboard Visibility</h2>
    <p>Your username, found spot count, XP, and streak are visible to other users on the public leaderboard. If you prefer not to appear there, you can use a pseudonym as your username.</p>

    <h2>5. Third Party Services</h2>
    <ul>
      <li><strong>Firebase (Google)</strong> — authentication and data storage. Subject to <a href="https://policies.google.com/privacy" target="_blank">Google's Privacy Policy</a></li>
      <li><strong>Cloudflare</strong> — hosting and edge delivery. Subject to <a href="https://www.cloudflare.com/privacypolicy/" target="_blank">Cloudflare's Privacy Policy</a></li>
    </ul>

    <h2>6. Children's Privacy</h2>
    <p>SpotSeekers is not directed at children under 13. We do not knowingly collect personal information from anyone under 13 years of age.</p>

    <h2>7. Data Deletion</h2>
    <p>You may request deletion of your account and all associated data at any time by contacting us. We will delete your data within 30 days of a verified request.</p>

    <h2>8. Changes to This Policy</h2>
    <p>We may update this policy as the app grows. The "last updated" date at the top reflects the most recent revision.</p>

    <h2>9. Contact</h2>
    <p>Questions or data deletion requests: <a href="mailto:aidas@spotseekers.net">aidas@spotseekers.net</a></p>
  </div>

  <!-- LITHUANIAN -->
  <div class="section" id="sec-lt">
    <h2>1. Kas Mes Esame</h2>
    <p>SpotSeekers — tai vietas atrandanti ir žaidybinė programa Lietuvai, kurią kuria nepriklausomas kūrėjas. Mūsų svetainė: <a href="https://www.spotseekers.net">www.spotseekers.net</a>.</p>

    <h2>2. Ką Renkame</h2>
    <ul>
      <li><strong>El. pašto adresas</strong> — naudojamas tik prisijungimui</li>
      <li><strong>Slapyvardis</strong> — jūsų pasirinktas, rodomas viešoje lyderių lentelėje</li>
      <li><strong>Žaidimo progresas</strong> — surinktos vietos, XP taškai, serijos, ženkleliai — saugomi mūsų duomenų bazėje, kad progresas išliktų visuose įrenginiuose</li>
      <li><strong>Vieta (GPS)</strong> — pasiekiama tik tada, kai paspaudžiate „Surinkti", siekiant patikrinti, ar esate fiziškai arti vietos. Jūsų vieta <strong>niekada nėra saugoma ar dalijamasi</strong></li>
    </ul>

    <h2>3. Ko Nerenkame</h2>
    <ul>
      <li>Neparduodame jūsų duomenų niekam</li>
      <li>Nenaudojame jūsų duomenų reklamai</li>
      <li>Nesekame jūsų buvimo vietos fone</li>
      <li>Nerenkame mokėjimo informacijos</li>
      <li>Nerenkame įrenginio identifikatorių, išskyrus tai, ko reikalauja Firebase</li>
    </ul>

    <h2>4. Lyderių Lentelės Matomumas</h2>
    <p>Jūsų slapyvardis, surinktų vietų skaičius, XP ir serija yra matomi kitiems naudotojams viešoje lyderių lentelėje. Jei nenorite ten pasirodyti, galite naudoti pseudonimą kaip slapyvardį.</p>

    <h2>5. Trečiųjų Šalių Paslaugos</h2>
    <ul>
      <li><strong>Firebase (Google)</strong> — autentifikacija ir duomenų saugojimas. Taikoma <a href="https://policies.google.com/privacy" target="_blank">Google privatumo politika</a></li>
      <li><strong>Cloudflare</strong> — prieglauda ir pristatymas. Taikoma <a href="https://www.cloudflare.com/privacypolicy/" target="_blank">Cloudflare privatumo politika</a></li>
    </ul>

    <h2>6. Vaikų Privatumas</h2>
    <p>SpotSeekers nėra skirta vaikams iki 13 metų. Mes sąmoningai nerenkame asmeninės informacijos iš asmenų iki 13 metų.</p>

    <h2>7. Duomenų Ištrynimas</h2>
    <p>Galite paprašyti ištrinti savo paskyrą ir visus susijusius duomenis bet kuriuo metu susisiekę su mumis. Ištrinsite duomenis per 30 dienų nuo patvirtinto prašymo.</p>

    <h2>8. Politikos Pakeitimai</h2>
    <p>Galime atnaujinti šią politiką augant programai. Viršuje esanti „paskutinio atnaujinimo" data rodo naujausią redakciją.</p>

    <h2>9. Kontaktai</h2>
    <p>Klausimai arba prašymai ištrinti duomenis: <a href="mailto:aidas@spotseekers.net">aidas@spotseekers.net</a></p>
  </div>

  <hr>
  <div class="footer">© 2026 SpotSeekers · <a href="https://www.spotseekers.net">www.spotseekers.net</a></div>
</div>
<script>
function switchLang(lang, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + lang).classList.add('active');
  btn.classList.add('active');
}
</script>
</body>
</html>`;

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

    // ── GET /privacy ──
    if (url.pathname === '/privacy') {
      return new Response(PRIVACY_HTML, {
        headers: {
          'Content-Type': 'text/html;charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
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
