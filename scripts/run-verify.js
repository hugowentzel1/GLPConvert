// Loads Verifyfile, navigates to URL (headed), runs assertions fast.
const fs = require('fs');
const { chromium, devices } = require('playwright');

const HEADS_UP = true;                    // headed so you can SEE it
const BLOCK_TP = process.env.BLOCK_TP ? true : false; // optional boost
const TIMEOUT  = parseInt(process.env.TIMEOUT_MS || '9000', 10);

function parseVerifyfile() {
  const vf = fs.readFileSync('Verifyfile','utf8');
  const blocks = [...vf.matchAll(/\[check\s+"([^"]+)"\]([\s\S]*?)(?=\n\[check|\s*$)/g)].map(m => ({
    name: m[1],
    body: m[2].trim()
  }));
  if (!blocks.length) throw new Error('Verifyfile has no [check "..."] blocks');
  // Use the LAST block (Cursor sets it for current change)
  const body = blocks[blocks.length-1].body;
  const get = key => (body.match(new RegExp(`^\\s*${key}\\s*=\\s*(.+)$`, 'm')) || [])[1]?.trim();
  const route = get('route') || '/';
  const kv = {};
  ['text','css','width','exists','hidden'].forEach(k => { const v = get(k); if (v) kv[k] = v; });
  return { route, kv };
}

function parsePairs(val){ const o={}; (''+val).split(':').filter(Boolean).forEach(p=>{const [k,...r]=p.split('='); if(r.length)o[k.trim()]=r.join('=').trim();}); return o; }

async function run(urlBase) {
  const { route, kv } = parseVerifyfile();
  const target = urlBase + route;
  console.log('🌐 Target:', target);

  const browser = await chromium.launch({ headless: !HEADS_UP, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
    bypassCSP: true,
  });
  if (BLOCK_TP) {
    await ctx.route('**/*', (route) => {
      const req = route.request(); const rt = req.resourceType(); const url = req.url();
      if (rt === 'image' || rt === 'font' || rt === 'media') return route.abort();
      if (/googletagmanager|google-analytics|segment|sentry|hotjar|fullstory|doubleclick|facebook\.net/.test(url)) return route.abort();
      route.continue();
    });
  }
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    const s = document.createElement('style');
    s.textContent='*{animation:none!important;transition:none!important} html{scroll-behavior:auto!important}';
    document.documentElement.appendChild(s);
  });
  page.on('console', m => console.log('📜', m.text()));
  page.on('requestfailed', r => console.log('⚠️ ', r.url(), r.failure()?.errorText || ''));

  await page.goto(target, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });

  // ---- Assertions ----
  async function must(sel){ await page.waitForSelector(sel, { timeout: 3000 }); }

  if (kv.exists) {
    for (const sel of kv.exists.split(',').map(s=>s.trim()).filter(Boolean)) {
      await must(sel);
      if (!(await page.locator(sel).isVisible())) throw new Error(`exists: not visible ${sel}`);
    }
  }
  if (kv.hidden) {
    for (const sel of kv.hidden.split(',').map(s=>s.trim()).filter(Boolean)) {
      const vis = await page.locator(sel).isVisible().catch(()=>false);
      if (vis) throw new Error(`hidden: still visible ${sel}`);
    }
  }
  if (kv.text) {
    for (const rule of kv.text.split('|')) {
      const m = rule.match(/^(.*?):"(.*)"$/); if (!m) throw new Error(`bad text rule: ${rule}`);
      const [_, sel, txt] = m;
      await must(sel);
      const got = await page.locator(sel).evaluate(el => el.textContent || '');
      if (!got.includes(txt)) throw new Error(`text: got "${got}" expected includes "${txt}" (${sel})`);
    }
  }
  if (kv.css) {
    for (const rule of kv.css.split('|')) {
      const m = rule.match(/^(.*?):"(.*)"$/); if (!m) throw new Error(`bad css rule: ${rule}`);
      const sel = m[1]; const prop = m[2].split(':')[0].trim(); const val = m[2].split(':').slice(1).join(':').trim();
      await must(sel);
      const got = await page.locator(sel).evaluate((el,p)=>getComputedStyle(el).getPropertyValue(p), prop);
      if (got.trim() !== val) throw new Error(`css: ${prop} "${got.trim()}" ≠ "${val}" (${sel})`);
    }
  }
  if (kv.width) {
    for (const rule of kv.width.split('|')) {
      const [sel, rest] = rule.split(':');
      const lim = parsePairs(':'+rest);
      await must(sel);
      const w = await page.locator(sel).evaluate(el => el.getBoundingClientRect().width);
      if (lim.min && w < +lim.min) throw new Error(`width ${w}px < min ${lim.min}px (${sel})`);
      if (lim.max && w > +lim.max) throw new Error(`width ${w}px > max ${lim.max}px (${sel})`);
    }
  }

  console.log('✅ Assertions passed:', target);
  await ctx.close(); await browser.close();
}

if (require.main === module) {
  const base = process.argv[2] || 'http://localhost:3001';
  run(base).catch(e => { console.error('❌', e.message || e); process.exit(1); });
} else {
  module.exports = { run };
}
