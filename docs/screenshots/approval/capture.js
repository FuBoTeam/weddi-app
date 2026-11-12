/*
 * Drive headless Chrome over the DevTools protocol and screenshot the
 * approval dashboard and waiting/approved live wall from an isolated mock build.
 *
 * Usage: node capture.js <chrome-debug-port> <app-origin> <out-dir>
 *
 * Every request that is not to 127.0.0.1/localhost is failed here (Chrome is
 * also started with host-resolver rules that resolve nothing else), so the
 * capture cannot reach Firebase or analytics at all.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const WebSocket = require('ws');

const [port, origin, outDir] = process.argv.slice(2);

const getJson = (url, method = 'GET') => new Promise((resolve, reject) => {
  const req = http.request(url, { method }, (res) => {
    let body = '';
    res.on('data', (c) => { body += c; });
    res.on('end', () => resolve(JSON.parse(body)));
  });
  req.on('error', reject);
  req.end();
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  const target = await getJson(`http://127.0.0.1:${port}/json/new?about:blank`, 'PUT');
  const ws = new WebSocket(target.webSocketDebuggerUrl, { perMessageDeflate: false });
  await new Promise((r) => ws.once('open', r));
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    } else if (msg.method) {
      listeners.forEach((l) => l(msg));
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    id += 1;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  return { ws, send, on: (fn) => listeners.push(fn) };
}

const blocked = [];

async function main() {
  const { ws, send, on } = await connect();
  on((msg) => {
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('page exception:', (msg.params.exceptionDetails.exception || {}).description || msg.params.exceptionDetails.text);
    }
  });
  on(async (msg) => {
    if (msg.method !== 'Fetch.requestPaused') return;
    const { requestId, request } = msg.params;
    const host = new URL(request.url).hostname;
    if (host === '127.0.0.1' || host === 'localhost' || request.url.startsWith('data:') || request.url.startsWith('blob:')) {
      send('Fetch.continueRequest', { requestId }).catch(() => {});
    } else {
      blocked.push(`${request.method} ${request.url}`);
      send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' }).catch(() => {});
    }
  });
  await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await send('Page.enable');
  await send('Runtime.enable');

  const evaluate = async (expression) => {
    const { result } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return result.value;
  };
  const waitFor = async (expression, timeout = 30000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await evaluate(expression)) return;
      await sleep(250);
    }
    const body = await evaluate('location.href + "\\n" + document.body.innerHTML.slice(0, 2000)');
    throw new Error(`timed out waiting for: ${expression}\n${body}`);
  };
  const viewport = (width, height, deviceScaleFactor, mobile) =>
    send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor, mobile });
  const go = async (url) => {
    await send('Page.navigate', { url });
    await sleep(500);
    await waitFor('document.readyState === "complete"');
  };
  const shoot = async (name) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, name), Buffer.from(data, 'base64'));
    console.log('wrote', name);
  };
  const allImagesLoaded = (sel) =>
    `[...document.querySelectorAll(${JSON.stringify(sel)})].length > 0 && [...document.querySelectorAll(${JSON.stringify(sel)})].every(i => i.complete && i.naturalWidth > 0)`;

  // Fixtures and all moderation writes exist only in localStorage / memory.
  await viewport(1280, 1000, 1, false);
  await go(`${origin}/`);
  await evaluate('localStorage.clear(); localStorage.setItem("capture-approval", "true")');
  await go(`${origin}/test/?v=dashboard`);
  await waitFor('!!document.querySelector(".dashboard__post img") && document.querySelector(".dashboard__post img").complete');
  assert(await evaluate('document.querySelector("input[type=checkbox]").checked'), 'approval starts on');
  assert(await evaluate('document.querySelector(".dashboard__queue").textContent.includes("Sample Guest")'), 'pending guest is queued');
  await shoot('dashboard-1280.png');

  await viewport(390, 1000, 1, true);
  await sleep(300);
  assert(await evaluate('document.documentElement.scrollWidth <= 390'), 'dashboard fits phone');
  await shoot('dashboard-390.png');

  await viewport(1280, 720, 1, false);
  await go(`${origin}/test/`);
  await waitFor('!!document.querySelector(".dialog.show-dialog")', 45000);
  await waitFor('!!document.querySelector(".container img.visible")', 45000);
  assert(await evaluate('document.querySelector(".dialog").textContent.includes("Earlier Guest")'), 'historical guest remains visible');
  assert(await evaluate('!document.querySelector(".dialog").textContent.includes("Sample Guest")'), 'pending guest stays off wall');
  await shoot('board-pending-1280.png');

  await go(`${origin}/test/?v=dashboard`);
  await waitFor('!!document.querySelector(".dashboard__post button")');
  // Exercise both toggle directions and the actual dashboard approve handler.
  await evaluate('document.querySelector("input[type=checkbox]").click()');
  await waitFor('!document.querySelector("input[type=checkbox]").checked');
  await evaluate('document.querySelector("input[type=checkbox]").click()');
  await waitFor('document.querySelector("input[type=checkbox]").checked');
  await evaluate('document.querySelector(".dashboard__post button").click()');
  await waitFor('!document.querySelector(".dashboard__post")');
  await go(`${origin}/test/`);
  await waitFor('!!document.querySelector(".dialog.show-dialog")', 45000);
  await waitFor('!!document.querySelector(".container img.visible")', 45000);
  assert(await evaluate('document.querySelector(".dialog").textContent.includes("Sample Guest")'), 'approved guest appears on wall');
  await shoot('board-approved-1280.png');

  console.log(`blocked ${blocked.length} non-local request(s)`);
  blocked.forEach((b) => console.log('  blocked', b));
  const unexpected = blocked.filter((b) => !/chrome-extension:|clients2\.google\.com|update\.googleapis\.com|accounts\.google\.com|safebrowsing|optimizationguide|fonts\.gstatic|fonts\.googleapis|ocsp\.|crlsets|crashlytics|google-analytics|www\.google\.com\/pagead/i.test(b));
  // Chrome itself may probe a few Google endpoints; fail only if the app tried a real backend.
  const appBackend = blocked.filter((b) => /firebaseio\.com|firebaseapp\.com|googleapis\.com\/v0\/b\/image\.weddi|image\.weddi\.app|google-analytics\.com|googletagmanager\.com|analytics/i.test(b));
  assert(appBackend.length === 0, 'capture reached or attempted a backend: ' + appBackend.join(', '));
  if (unexpected.length) {
    console.log('note: additional blocked non-local requests (not treated as backend):');
    unexpected.forEach((b) => console.log('  ', b));
  }
  console.log('PASS: mock dashboard toggle/approve, phone layout, pending exclusion and approved wall');
  ws.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
