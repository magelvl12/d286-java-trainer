// Content checks. Run with: node tools/check.js
// - every solution matches HANDOFF.md character for character
// - every sample output appears verbatim in HANDOFF.md
// - predict exercises that run a full solution on a sample input expect that sample's output
// - template fills, walkthrough steps and exercises are well formed
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = {};
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ['content/problems.js', 'content/reference.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
}
const { PROBLEMS, REFERENCE } = ctx;
const handoff = fs.readFileSync(path.join(root, 'HANDOFF.md'), 'utf8');

const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

const sections = {};
handoff.split(/^### Problem (\d+):/m).forEach((chunk, i, arr) => {
  if (i % 2 === 1) sections[+chunk] = arr[i + 1].split(/^## /m)[0];
});

function checkChoice(where, ex) {
  if (!Array.isArray(ex.choices) || ex.choices.length < 2) return fail(where, 'needs at least 2 choices');
  if (!(ex.answer >= 0 && ex.answer < ex.choices.length)) fail(where, 'answer index out of range');
  if (new Set(ex.choices).size !== ex.choices.length) fail(where, 'duplicate choices');
  for (const k of Object.keys(ex.wrong || {})) {
    if (!(+k >= 0 && +k < ex.choices.length) || +k === ex.answer) fail(where, `wrong[${k}] points at a bad index`);
  }
  ex.choices.forEach((c, i) => {
    if (i !== ex.answer && !(ex.wrong && ex.wrong[i])) fail(where, `choice ${i} has no "why it's wrong"`);
  });
}

function checkExercise(where, ex) {
  if (!ex.q) fail(where, 'missing q');
  switch (ex.type) {
    case 'header': case 'pick': checkChoice(where, ex); break;
    case 'predict':
      if (!ex.code) fail(where, 'missing code');
      if (ex.typed == null) checkChoice(where, ex);
      break;
    case 'fill':
      ex.blanks.forEach((b, i) => {
        const n = ex.code.split(`__${i}__`).length - 1;
        if (n !== 1) fail(where, `marker __${i}__ appears ${n} times`);
        for (const t of [].concat(b)) if (!ex.bank.includes(t)) fail(where, `blank ${i} answer "${t}" not in bank`);
      });
      if (/__\d+__/.test(ex.code.replace(/__(\d+)__/g, (m, d) => (+d < ex.blanks.length ? '' : m)))) fail(where, 'extra blank marker');
      break;
    case 'order':
      if (!ex.lines || ex.lines.length < 3) fail(where, 'order needs 3+ lines');
      break;
    case 'bug': {
      const lines = ex.code.split('\n');
      for (const l of [].concat(ex.line)) if (!lines[l] || !lines[l].trim()) fail(where, `bug line ${l} is empty or missing`);
      if (!(ex.fixes && ex.fixes[ex.fix])) fail(where, 'bad fix index');
      if (!(ex.errors && ex.errors[ex.error])) fail(where, 'bad error index');
      break;
    }
    case 'cold':
      if (!ex.accept || !ex.accept.length) fail(where, 'cold needs accept');
      if (ex.context && !ex.context.includes('@@')) fail(where, 'context has no @@ slot');
      break;
    default: fail(where, `unknown type ${ex.type}`);
  }
}

if (PROBLEMS.length !== 14) fail('PROBLEMS', `expected 14, got ${PROBLEMS.length}`);

for (const p of PROBLEMS) {
  const at = `Problem ${p.id}`;
  const sec = sections[p.id];
  if (!sec) { fail(at, 'no section in HANDOFF.md'); continue; }

  const m = sec.match(/\*\*Solution[^\n]*\n```java\n([\s\S]*?)\n```/);
  if (!m) fail(at, 'no solution block in HANDOFF.md');
  else if (m[1] !== p.solution) fail(at, 'solution differs from HANDOFF.md');

  p.samples.forEach((s, i) => {
    if (!s.output.endsWith('\n')) fail(at, `sample ${i + 1} output lacks the final newline`);
    if (!sec.includes(s.output.slice(0, -1))) fail(at, `sample ${i + 1} output not found verbatim in HANDOFF.md`);
  });

  const solLines = new Set(p.solution.split('\n').map(l => l.trim()).filter(Boolean));
  const markers = p.files.flatMap(f => (f.code || '').match(/@@\d+@@/g) || []);
  if (markers.length !== p.fill.length) fail(at, `${markers.length} template slots but ${p.fill.length} fills`);
  p.fill.forEach((f, i) => f.split('\n').map(l => l.trim()).filter(Boolean).forEach(l => {
    if (!solLines.has(l)) fail(at, `fill ${i} line not in solution: ${l}`);
  }));
  p.steps.forEach((s, i) => s.code.split('\n').map(l => l.trim()).filter(Boolean).forEach(l => {
    if (!solLines.has(l)) fail(at, `step ${i + 1} line not in solution: ${l}`);
  }));

  if (p.exercises.length < 6) fail(at, `only ${p.exercises.length} exercises`);
  const types = new Set(p.exercises.map(e => e.type));
  if (types.size < 4) fail(at, `only ${types.size} exercise types`);
  p.exercises.forEach((ex, i) => {
    const where = `${at} exercise ${i + 1} (${ex.type})`;
    checkExercise(where, ex);
    if (ex.type === 'predict' && ex.code === p.solution && ex.input != null) {
      const s = p.samples.find(x => x.input === ex.input);
      if (s && ex.choices[ex.answer] !== s.output) fail(where, 'answer differs from the sample output');
    }
  });
}

REFERENCE.rules.forEach((r, i) => checkExercise(`Rule ${i + 1} quiz`, r.quiz));

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
const total = PROBLEMS.reduce((n, p) => n + p.exercises.length, 0);
console.log(`OK: 14 problems, ${total} exercises, ${REFERENCE.rules.length} rules, ${REFERENCE.errors.length} errors, ${REFERENCE.decoder.length} decoder entries.`);
