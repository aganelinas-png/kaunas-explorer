// SpotSeekers — Cloudflare Worker

const GITHUB_HTML_PROD    = 'https://raw.githubusercontent.com/aganelinas-png/kaunas-explorer/main/index.html';
const GITHUB_HTML_STAGING = 'https://raw.githubusercontent.com/aganelinas-png/kaunas-explorer/Staging/index.html';

const ADMIN_SECRET_PLACEHOLDER = `window._adminSecret='ADMIN_SECRET_PLACEHOLDER';`;

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
    <p>Questions or data deletion requests: <a href="mailto:privacy@spotseekers.net">privacy@spotseekers.net</a></p>
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
    <p>Klausimai arba prašymai ištrinti duomenis: <a href="mailto:privacy@spotseekers.net">privacy@spotseekers.net</a></p>
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

const DELETE_ACCOUNT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Delete Account — SpotSeekers</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#0e0c09;color:#e8e0d0;padding:40px 20px;line-height:1.7}
  .wrap{max-width:600px;margin:0 auto}
  h1{font-size:1.8rem;color:#c9a84c;margin-bottom:6px}
  h2{font-size:1.1rem;color:#c9a84c;margin:28px 0 8px}
  p,li{font-size:.95rem;color:#c0b8a8;margin-bottom:8px}
  ul{padding-left:20px;margin-bottom:16px}
  .updated{font-size:.8rem;color:#6a6050;margin-bottom:32px}
  .card{background:#1a1710;border:1px solid #2e2a20;border-radius:12px;padding:24px;margin-top:24px}
  .btn{display:inline-block;margin-top:16px;background:#c9a84c;color:#0e0c09;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:600;font-size:.95rem}
  a{color:#c9a84c}
  hr{border:none;border-top:1px solid #2e2a20;margin:32px 0}
  .footer{font-size:.75rem;color:#4a4538;text-align:center;margin-top:32px}
  .lang-switch{display:flex;gap:12px;margin-bottom:32px}
  .lang-btn{background:#1a1710;border:1px solid #2e2a20;color:#c9a84c;padding:6px 16px;border-radius:20px;cursor:pointer;font-size:.85rem}
  .lang-btn.active{background:#c9a84c;color:#0e0c09}
  .section{display:none}.section.active{display:block}
</style>
</head>
<body>
<div class="wrap">
  <h1>🗺 SpotSeekers</h1>
  <div class="updated">Account Deletion · spotseekers.net</div>

  <div class="lang-switch">
    <button class="lang-btn active" onclick="switchLang('en',this)">English</button>
    <button class="lang-btn" onclick="switchLang('lt',this)">Lietuviškai</button>
  </div>

  <div class="section active" id="sec-en">
    <h2>Delete Your Account</h2>
    <p>You can request deletion of your SpotSeekers account and all associated data at any time.</p>
    <p>The following data will be permanently deleted:</p>
    <ul>
      <li>Your email address and login credentials</li>
      <li>Your username</li>
      <li>Your game progress — found spots, XP, streaks, badges</li>
    </ul>
    <p>Deletion is permanent and cannot be undone. Your leaderboard entry will also be removed.</p>
    <div class="card">
      <p>To request deletion, send an email from your registered account address to: <a href="mailto:aidas@spotseekers.net">aidas@spotseekers.net</a></p>
      <p style="margin-top:12px;font-size:.8rem;color:#6a6050">We will process your request within 30 days.</p>
    </div>
  </div>

  <div class="section" id="sec-lt">
    <h2>Ištrinkite Savo Paskyrą</h2>
    <p>Galite bet kada paprašyti ištrinti savo SpotSeekers paskyrą ir visus susijusius duomenis.</p>
    <p>Bus visam laikui ištrinti šie duomenys:</p>
    <ul>
      <li>Jūsų el. pašto adresas ir prisijungimo duomenys</li>
      <li>Jūsų slapyvardis</li>
      <li>Jūsų žaidimo progresas — surinktos vietos, XP, serijos, ženkleliai</li>
    </ul>
    <p>Ištrynimas yra negrįžtamas. Jūsų įrašas lyderių lentelėje taip pat bus pašalintas.</p>
    <div class="card">
      <p>Norėdami pateikti prašymą, rašykite iš savo registruoto el. pašto adreso į: <a href="mailto:aidas@spotseekers.net">aidas@spotseekers.net</a></p>
      <p style="margin-top:12px;font-size:.8rem;color:#6a6050">Jūsų prašymą apdorosime per 30 dienų.</p>
    </div>
  </div>

  <hr>
  <div class="footer">© 2026 SpotSeekers · <a href="https://www.spotseekers.net">www.spotseekers.net</a> · <a href="/privacy">Privacy Policy</a></div>
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

const DOWNLOAD_HTML = `<!DOCTYPE html>
<html lang="lt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Atsisiųsti — SpotSeekers</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0e0c09;
  --surf:#141210;
  --surf2:#1a1710;
  --bdr:#2e2a20;
  --gold:#c9a84c;
  --gold2:#e8c96a;
  --txt:#e8e0d0;
  --td:#9a9080;
  --tm:#6a6050;
}
html{scroll-behavior:smooth}
body{
  font-family:'DM Sans',sans-serif;
  background:var(--bg);
  color:var(--txt);
  min-height:100vh;
  padding:0;
  overflow-x:hidden;
}

/* Background grain */
body::before{
  content:'';
  position:fixed;
  inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events:none;
  z-index:0;
  opacity:.4;
}

.wrap{
  max-width:520px;
  margin:0 auto;
  padding:48px 20px 60px;
  position:relative;
  z-index:1;
}

/* Header */
.header{text-align:center;margin-bottom:48px}
.logo-glyph{font-size:2.8rem;margin-bottom:12px;display:block;animation:float 4s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.logo-name{
  font-family:'Playfair Display',serif;
  font-size:2rem;
  color:var(--gold);
  letter-spacing:.01em;
  margin-bottom:6px;
}
.logo-sub{
  font-family:'DM Mono',monospace;
  font-size:.72rem;
  color:var(--tm);
  letter-spacing:.08em;
  text-transform:uppercase;
}
.header-desc{
  margin-top:16px;
  font-size:.95rem;
  color:var(--td);
  line-height:1.6;
  max-width:360px;
  margin-left:auto;
  margin-right:auto;
}

/* Divider */
.divider{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:24px;
}
.divider::before,.divider::after{
  content:'';
  flex:1;
  height:1px;
  background:var(--bdr);
}
.divider-text{
  font-family:'DM Mono',monospace;
  font-size:.65rem;
  color:var(--tm);
  letter-spacing:.1em;
  text-transform:uppercase;
  white-space:nowrap;
}

/* Device cards */
.cards{display:flex;flex-direction:column;gap:12px;margin-bottom:32px}

.card{
  background:var(--surf);
  border:1px solid var(--bdr);
  border-radius:16px;
  overflow:hidden;
  transition:border-color .2s,transform .15s;
  cursor:pointer;
}
.card:hover{border-color:rgba(201,168,76,.4);transform:translateY(-1px)}
.card.disabled{opacity:.55;cursor:default}
.card.disabled:hover{border-color:var(--bdr);transform:none}

.card-header{
  display:flex;
  align-items:center;
  gap:14px;
  padding:18px 20px;
  user-select:none;
}
.card-icon{
  font-size:1.8rem;
  width:44px;
  text-align:center;
  flex-shrink:0;
}
.card-info{flex:1;min-width:0}
.card-title{
  font-size:1rem;
  font-weight:600;
  color:var(--txt);
  margin-bottom:2px;
}
.card-meta{
  font-family:'DM Mono',monospace;
  font-size:.68rem;
  color:var(--td);
}
.card-badge{
  font-family:'DM Mono',monospace;
  font-size:.6rem;
  font-weight:500;
  padding:3px 9px;
  border-radius:20px;
  white-space:nowrap;
  flex-shrink:0;
}
.badge-rec{background:rgba(201,168,76,.15);color:var(--gold);border:1px solid rgba(201,168,76,.3)}
.badge-soon{background:rgba(100,90,70,.15);color:var(--tm);border:1px solid rgba(100,90,70,.3)}
.card-chevron{
  color:var(--tm);
  font-size:1rem;
  transition:transform .25s;
  flex-shrink:0;
}
.card.open .card-chevron{transform:rotate(90deg)}

/* Instructions panel */
.card-body{
  display:none;
  border-top:1px solid var(--bdr);
  padding:20px;
  background:var(--surf2);
}
.card.open .card-body{display:block}

.steps{display:flex;flex-direction:column;gap:16px;margin-bottom:20px}
.step{display:flex;gap:14px;align-items:flex-start}
.step-num{
  width:26px;
  height:26px;
  border-radius:50%;
  background:rgba(201,168,76,.12);
  border:1px solid rgba(201,168,76,.3);
  color:var(--gold);
  font-family:'DM Mono',monospace;
  font-size:.72rem;
  font-weight:500;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
  margin-top:1px;
}
.step-text{font-size:.88rem;color:var(--td);line-height:1.55}
.step-text strong{color:var(--txt);font-weight:600}

.warning-box{
  background:rgba(201,168,76,.06);
  border:1px solid rgba(201,168,76,.2);
  border-radius:10px;
  padding:12px 14px;
  font-size:.78rem;
  color:var(--td);
  line-height:1.5;
  margin-bottom:16px;
}
.warning-box strong{color:var(--gold)}

.action-btn{
  display:block;
  width:100%;
  background:var(--gold);
  color:#0e0c09;
  border:none;
  border-radius:12px;
  padding:14px 20px;
  font-family:'DM Sans',sans-serif;
  font-size:.95rem;
  font-weight:700;
  text-align:center;
  text-decoration:none;
  cursor:pointer;
  transition:background .2s,transform .15s;
  letter-spacing:.01em;
}
.action-btn:hover{background:var(--gold2);transform:scale(1.01)}
.action-btn:active{transform:scale(.98)}

.soon-box{
  text-align:center;
  padding:8px 0 4px;
}
.soon-icon{font-size:2rem;margin-bottom:8px}
.soon-text{font-size:.88rem;color:var(--td);line-height:1.6}
.soon-text strong{color:var(--txt)}

/* Footer */
.footer{
  text-align:center;
  padding-top:32px;
  border-top:1px solid var(--bdr);
}
.footer a{
  color:var(--gold);
  text-decoration:none;
  font-size:.85rem;
  font-weight:500;
  transition:opacity .2s;
}
.footer a:hover{opacity:.7}
.footer-copy{
  font-family:'DM Mono',monospace;
  font-size:.65rem;
  color:var(--tm);
  margin-top:10px;
}
</style>
</head>
<body>
<div class="wrap">

  <!-- Header -->
  <div class="header">
    <span class="logo-glyph">🗺</span>
    <div class="logo-name">SpotSeekers</div>
    <div class="logo-sub">Atrask · Surink · Laimėk</div>
    <p class="header-desc">Pasirink, kaip nori naudoti SpotSeekers — kaip programėlę ar tiesiai naršyklėje.</p>
  </div>

  <div class="divider"><span class="divider-text">Pasirink įrenginį</span></div>

  <div class="cards">

    <!-- Android PWA -->
    <div class="card" id="card-android-pwa" onclick="toggleCard('android-pwa')">
      <div class="card-header">
        <div class="card-icon">🤖</div>
        <div class="card-info">
          <div class="card-title">Android — naršyklė kaip programėlė</div>
          <div class="card-meta">Chrome · Pridėti į ekraną</div>
        </div>
        <span class="card-badge badge-rec">Rekomenduojama</span>
        <span class="card-chevron">›</span>
      </div>
      <div class="card-body">
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-text">Atidaryk <strong>Chrome</strong> naršyklę ir eik į <strong>spotseekers.net</strong></div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-text">Viršuje dešinėje spustelėk <strong>⋮ meniu</strong> (trys taškai)</div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-text">Pasirink <strong>„Pridėti į pradinį ekraną"</strong></div>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <div class="step-text">Patvirtink — SpotSeekers atsiras kaip programėlė tavo telefone 🎉</div>
          </div>
        </div>
        <a class="action-btn" href="https://www.spotseekers.net" target="_blank">Atidaryti SpotSeekers →</a>
      </div>
    </div>

    <!-- iPhone PWA -->
    <div class="card" id="card-iphone-pwa" onclick="toggleCard('iphone-pwa')">
      <div class="card-header">
        <div class="card-icon">🍎</div>
        <div class="card-info">
          <div class="card-title">iPhone — naršyklė kaip programėlė</div>
          <div class="card-meta">Safari · Pridėti į ekraną</div>
        </div>
        <span class="card-chevron">›</span>
      </div>
      <div class="card-body">
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-text">Atidaryk <strong>Safari</strong> naršyklę ir eik į <strong>spotseekers.net</strong></div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-text">Apačioje viduryje spustelėk <strong>„Dalintis"</strong> mygtuką (□↑)</div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-text">Slinkite žemyn ir pasirink <strong>„Pridėti į pradinį ekraną"</strong></div>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <div class="step-text">Patvirtink — SpotSeekers atsiras kaip programėlė tavo iPhone 🎉</div>
          </div>
        </div>
        <a class="action-btn" href="https://www.spotseekers.net" target="_blank">Atidaryti SpotSeekers →</a>
      </div>
    </div>

    <!-- Android APK -->
    <div class="card" id="card-apk" onclick="toggleCard('apk')">
      <div class="card-header">
        <div class="card-icon">📦</div>
        <div class="card-info">
          <div class="card-title">Android — APK diegimas</div>
          <div class="card-meta">Tiesioginis atsisiuntimas</div>
        </div>
        <span class="card-chevron">›</span>
      </div>
      <div class="card-body">
        <div class="warning-box">
          ⚠️ <strong>Svarbu:</strong> Prieš diegiant reikės leisti įdiegti programas iš nežinomų šaltinių. Tai saugu — tai oficiali SpotSeekers programėlė.
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-text">Atsisiųsk APK failą žemiau esančiu mygtuku</div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-text">Eik į <strong>Nustatymai → Saugumas</strong> ir įjunk <strong>„Nežinomi šaltiniai"</strong> arba leisk diegimą kai telefono paprašys</div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-text">Atidaryk atsisiųstą <strong>.apk</strong> failą ir spustelėk <strong>„Įdiegti"</strong></div>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <div class="step-text">Paleisk SpotSeekers ir pradėk tyrinėti! 🗺</div>
          </div>
        </div>
        <a class="action-btn" href="https://cdn.spotseekers.net/app-release.apk" download>⬇ Atsisiųsti APK</a>
      </div>
    </div>

    <!-- iOS native — coming soon -->
    <div class="card disabled" id="card-ios">
      <div class="card-header">
        <div class="card-icon" style="opacity:.5">🍏</div>
        <div class="card-info">
          <div class="card-title" style="color:var(--td)">iPhone — native programėlė</div>
          <div class="card-meta">App Store</div>
        </div>
        <span class="card-badge badge-soon">Netrukus</span>
      </div>
    </div>

  </div>

  <!-- Footer -->
  <div class="footer">
    <a href="https://www.spotseekers.net">← Grįžti į SpotSeekers</a>
    <div class="footer-copy">© 2026 SpotSeekers · <a href="/privacy" style="color:var(--tm);font-size:.65rem">Privatumo politika</a></div>
  </div>

</div>

<script>
function toggleCard(id) {
  const card = document.getElementById('card-' + id);
  if (!card || card.classList.contains('disabled')) return;
  const isOpen = card.classList.contains('open');
  // Close all
  document.querySelectorAll('.card.open').forEach(c => c.classList.remove('open'));
  // Toggle clicked
  if (!isOpen) card.classList.add('open');
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

    // ── GET /delete-account ──
    if (url.pathname === '/delete-account') {
      return new Response(DELETE_ACCOUNT_HTML, {
        headers: {
          'Content-Type': 'text/html;charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }


    // ── GET /download ──
    if (url.pathname === '/download') {
      return new Response(DOWNLOAD_HTML, {
        headers: {
          'Content-Type': 'text/html;charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // ── GET /api/spots ──
    if (url.pathname === '/api/spots') {
      const country = (url.searchParams.get('country') || 'LT').toUpperCase();
      const kvKey = country === 'PL' ? 'spots_pl_v1' : 'spots_lt_v1';
      let spots = await env.SPOTS_KV.get(kvKey);
      // Backward compat: if spots_lt_v1 empty, try legacy spots_v1
      if (!spots && country === 'LT') spots = await env.SPOTS_KV.get('spots_v1');
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
        const country = (url.searchParams.get('country') || 'LT').toUpperCase();
        const kvKey = country === 'PL' ? 'spots_pl_v1' : 'spots_lt_v1';
        await env.SPOTS_KV.put(kvKey, body);
        // Also write legacy key for LT backward compat
        if (country === 'LT') await env.SPOTS_KV.put('spots_v1', body);
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
      const country = (url.searchParams.get('country') || 'LT').toUpperCase();
      const kvKey = country === 'PL' ? 'spots_pl_v1' : 'spots_lt_v1';
      let spots = await env.SPOTS_KV.get(kvKey);
      if (!spots && country === 'LT') spots = await env.SPOTS_KV.get('spots_v1');
      if (!spots) return new Response(JSON.stringify({ cached: false, country }), {
        headers: { 'Content-Type': 'application/json' }
      });
      const arr = JSON.parse(spots);
      return new Response(JSON.stringify({ cached: true, count: arr.length, country, kvKey }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ── GET /api/zabytek — CORS proxy to Polish heritage registry (NID) ──
    if (url.pathname === '/api/zabytek') {
      const secret = request.headers.get('X-Admin-Secret');
      if (secret !== adminSecret) {
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

    // Inject admin secret
    const secret = env.ADMIN_SECRET || 'lithuania2026';
    html = html.replace(ADMIN_SECRET_PLACEHOLDER, `window._adminSecret='${secret}';`);

    const headers = { 'Content-Type': 'text/html;charset=utf-8' };
    if (isStaging) headers['X-Environment'] = 'staging';

    return new Response(html, { headers });
  }
};
