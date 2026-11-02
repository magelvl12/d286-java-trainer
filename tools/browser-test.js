// End-to-end test in headless Chrome at iPhone size. Answers every exercise in every
// problem correctly through the real UI, checks each one is marked correct, checks the
// status reaches "Passed with help", tries one wrong answer per exercise type, opens every
// screen, and saves screenshots to tools/screens/.
//
// Usage: python3 -m http.server 8286   (in another terminal), then
//        node tools/browser-test.js [path-to-chrome]
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME = process.argv[2] || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://127.0.0.1:8286/';
const PORT = 9333;
const shots = path.join(__dirname, 'screens');
fs.mkdirSync(shots, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const profile = fs.mkdtempSync(path.join(require('os').tmpdir(), 'd286-chrome-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });

let ws, nextId = 1;
const pending = new Map();
const exceptions = [];

function send(method, params = {}) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}
async function js(expr) {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text} ${JSON.stringify(r.exceptionDetails.exception && r.exceptionDetails.exception.description)}`);
  return r.result.value;
}
async function shot(name) {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(shots, `${name}.png`), Buffer.from(r.data, 'base64'));
}
async function go(hash) { await js(`location.hash = ${JSON.stringify(hash)}; 0`); await sleep(60); }

// Runs in the page: answers the current exercise, correctly or not.
const ANSWER = `
window.__answer = function (ex, right) {
  const box = document.querySelector('.ex');
  const click = el => { if (!el) throw new Error('missing element for ' + ex.type + ': ' + ex.q); el.click(); };
  const pickChoice = (scope, list, answer) => {
    const want = right ? answer : list.findIndex((_, i) => i !== answer);
    click(scope.querySelector('.choice[data-i="' + want + '"]'));
  };
  switch (ex.type) {
    case 'header': case 'pick': pickChoice(box, ex.choices, ex.answer); break;
    case 'predict':
      if (ex.typed != null) { box.querySelector('input').value = right ? ex.typed : ex.typed + 'x'; click(box.querySelector('.btn.primary')); }
      else pickChoice(box, ex.choices, ex.answer);
      break;
    case 'fill': {
      ex.blanks.forEach((b, i) => {
        click(box.querySelector('.blank[data-b="' + i + '"]'));
        const want = right ? [].concat(b)[0] : ex.bank.find(t => ![].concat(b).includes(t));
        click([...box.querySelectorAll('.chip')].find(c => c.textContent === want));
      });
      click(box.querySelector('.check'));
      break;
    }
    case 'order': {
      const lines = ex.lines.map(l => l.trim());
      const seq = right ? lines : lines.slice().reverse();
      seq.forEach(t => click([...box.querySelectorAll('.pline')].find(b => b.textContent === t)));
      click(box.querySelector('.check'));
      break;
    }
    case 'bug': {
      const bad = [].concat(ex.line)[0];
      const lines = ex.code.split('\\n');
      const other = lines.findIndex((l, i) => l.trim() && ![].concat(ex.line).includes(i));
      click(box.querySelector('.bugline[data-i="' + (right ? bad : other) + '"]'));
      const steps = box.querySelector('.bugsteps');
      click(steps.querySelector('.choice[data-i="' + ex.fix + '"]'));
      click(steps.lastElementChild.querySelector('.choice[data-i="' + ex.error + '"]'));
      break;
    }
    case 'cold':
      box.querySelector('textarea').value = right ? ex.accept[0] : ex.accept[0].replace(/;/, '');
      click(box.querySelector('.check'));
      break;
  }
  const fb = box.querySelector('.fb');
  return fb ? (fb.classList.contains('ok') ? 'ok' : 'bad') : 'none';
};`;

(async () => {
  let failures = 0;
  const fail = m => { failures++; console.log('FAIL ' + m); };
  try {
    for (let i = 0; i < 50; i++) {
      try { await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; } catch (e) { await sleep(100); }
    }
    const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${URL}`, { method: 'PUT' })).json();
    ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));
    ws.addEventListener('message', e => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) {
        const p = pending.get(m.id); pending.delete(m.id);
        m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result);
      } else if (m.method === 'Runtime.exceptionThrown') {
        exceptions.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
      }
    });
    await send('Runtime.enable');
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: URL });
    await sleep(800);
    await js('localStorage.clear(); location.reload(); 0');
    await sleep(800);
    await js(ANSWER + '0');

    const items = await js('document.querySelectorAll(".pitem").length');
    if (items !== 14) fail(`home shows ${items} problems`);
    await shot('01-home');

    // Every screen and tab renders.
    for (const h of ['#/rules', '#/errors', '#/decode', '#/progress', '#/weak']) {
      await go(h);
      const len = await js('document.getElementById("view").textContent.length');
      if (len < 50) fail(`${h} looks empty`);
    }
    const nProblems = await js('PROBLEMS.length');
    for (let id = 1; id <= nProblems; id++) {
      for (const tab of ['problem', 'template', 'walk', 'practice']) {
        await go(`#/p/${id}/${tab}`);
        const len = await js('document.getElementById("tab").textContent.length');
        if (len < 50) fail(`problem ${id} ${tab} looks empty`);
      }
    }
    // Pages wider than the phone mean something isn't scrolling inside its own box.
    for (const h of ['#/', '#/p/5/walk', '#/p/11/template', '#/p/14/problem', '#/rules', '#/errors', '#/decode', '#/progress']) {
      await go(h);
      const w = await js('document.documentElement.scrollWidth');
      if (w > 390) fail(`${h} is ${w}px wide (horizontal page scroll)`);
    }

    // Answer every exercise correctly through the UI, then check the status.
    for (let id = 1; id <= nProblems; id++) {
      await go(`#/practice/${id}`);
      const n = await js(`PROBLEMS[${id - 1}].exercises.length`);
      for (let k = 0; k < n; k++) {
        const res = await js(`__answer(PROBLEMS[${id - 1}].exercises[${k}], true)`);
        if (res !== 'ok') fail(`problem ${id} exercise ${k + 1}: correct answer marked ${res}`);
        if (id === 5 && k < 7) await shot(`p05-ex${k + 1}`);
        await js('document.querySelector(".sess-nav .next").click(); 0');
      }
      const status = await js(`Store.prob(${id}).status`);
      if (status !== 'helped') fail(`problem ${id} status after a perfect run is ${status}`);
    }

    // One wrong answer per type gets marked wrong and shows feedback.
    await js('Store.reset(); 0');
    const tried = new Set();
    for (let id = 1; id <= nProblems; id++) {
      const types = await js(`PROBLEMS[${id - 1}].exercises.map(e => e.type)`);
      await go(`#/practice/${id}`);
      for (let k = 0; k < types.length; k++) {
        if (!tried.has(types[k])) {
          tried.add(types[k]);
          const res = await js(`__answer(PROBLEMS[${id - 1}].exercises[${k}], false)`);
          if (res !== 'bad') fail(`problem ${id} exercise ${k + 1} (${types[k]}): wrong answer marked ${res}`);
          await shot(`wrong-${types[k]}`);
        }
        await js('document.querySelector(".sess-nav .next").click(); 0');
      }
    }

    // Exit mid-session shows the summary with retake.
    await go('#/practice/2');
    await js(`__answer(PROBLEMS[1].exercises[0], false); document.querySelector(".sess-nav .exit").click(); 0`);
    const hasRetake = await js('!!document.querySelector("[data-a=retake]")');
    if (!hasRetake) fail('exit summary has no "Retake missed only"');
    await shot('summary');
    await js('document.querySelector("[data-a=retake]").click(); 0');
    const retakeCount = await js('document.querySelector(".sess-head span").textContent');
    if (!/of 7/.test(retakeCount)) fail(`retake shows "${retakeCount}"`);

    // Weak spots now has items; every rule quiz works.
    await go('#/weak');
    if (!(await js('!!document.querySelector(".ex")'))) fail('weak spots session did not start');
    await go('#/rules');
    const rules = await js('REFERENCE.rules.length');
    for (let i = 0; i < rules; i++) {
      await js(`document.querySelectorAll("details.rule")[${i}].open = true; document.querySelectorAll(".quizbtn")[${i}].click(); 0`);
      const ok = await js(`(() => { const ex = REFERENCE.rules[${i}].quiz; const q = document.querySelectorAll(".quiz")[${i}];
        q.querySelector('.choice[data-i="' + ex.answer + '"]').click(); return !!q.querySelector(".fb.ok"); })()`);
      if (!ok) fail(`rule ${i + 1} quiz`);
    }
    await shot('rules');

    // Screens for a look.
    for (const [h, name] of [['#/p/7/problem', 'p07-problem'], ['#/p/12/template', 'p12-template'], ['#/p/7/walk', 'p07-walk'], ['#/errors', 'errors'], ['#/decode', 'decode'], ['#/progress', 'progress'], ['#/', '02-home-after']]) {
      await go(h);
      await shot(name);
    }

    if (exceptions.length) { failures += exceptions.length; console.log('PAGE EXCEPTIONS:\n' + exceptions.join('\n')); }
  } catch (e) {
    failures++;
    console.log('ERROR ' + e.stack);
  } finally {
    try { ws && ws.close(); } catch (e) { /* closing */ }
    chrome.kill();
    await new Promise(r => chrome.once('exit', r));
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* temp dir, fine to leave */ }
  }
  console.log(failures ? `\n${failures} failure(s).` : 'All browser checks passed.');
  process.exit(failures ? 1 : 0);
})();
