// Exercise renderers (one per type) and the practice-session runner.
// A renderer draws into a box and calls finish(ok, feedbackHtml) exactly once. It then
// leaves its controls disabled, so the box's HTML can be kept as a read-only review.
(function () {
  const { esc, hl, vis, md } = window.H;

  const LABELS = {
    fill: 'Fill the blank', order: 'Line order', predict: 'Predict the output', bug: 'Bug hunt',
    header: 'Match the header', pick: 'Pick one', cold: 'Type it cold'
  };

  const shuffle = a => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const straightQuotes = s => s.replace(/[“”„″]/g, '"').replace(/[‘’′]/g, "'");

  function add(root, html) {
    const w = document.createElement('div');
    w.innerHTML = html;
    root.appendChild(w);
    return w;
  }

  const codeBlock = c => `<pre class="code">${hl(c)}</pre>`;
  const outBlock = t => `<pre class="out">${vis(t)}</pre>`;

  function feedback(ok, f) {
    let h = `<div class="fb ${ok ? 'ok' : 'bad'}"><div class="fb-head">${ok ? '✓ Correct' : '✗ Not quite'}</div>`;
    if (!ok && f.correct) h += `<div class="label">Correct answer</div>${f.correct}`;
    if (!ok && f.yours) h += `<div class="label">Your answer</div>${f.yours}`;
    if (!ok && f.yoursWhy) h += `<p class="whywrong">${md(f.yoursWhy)}</p>`;
    if (f.extra) h += f.extra;
    if (f.why) h += `<div class="label">Why</div><p>${md(f.why)}</p>`;
    return h + '</div>';
  }

  // Multiple choice: shuffled buttons; marks right/wrong and hands back the picked index.
  function choices(w, list, answer, show, onPick) {
    const box = add(w, `<div class="choices">${shuffle(list.map((_, i) => i))
      .map(i => `<button class="choice" data-i="${i}">${show(list[i])}</button>`).join('')}</div>`);
    const btns = [...box.querySelectorAll('.choice')];
    btns.forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      btns.forEach(x => {
        x.disabled = true;
        const j = +x.dataset.i;
        if (j === answer) x.classList.add('right');
        else if (j === i) x.classList.add('wrong');
      });
      onPick(i);
    });
  }

  const R = {};

  // header / pick: choose one code line (or a plain-text answer with plain: true).
  R.header = R.pick = (ex, root, finish) => {
    const show = c => ex.plain ? `<span class="ct">${md(c)}</span>`
      : `<span class="cc">${ex.ws ? vis(c) : hl(c)}</span>`;
    const w = add(root, ex.code ? codeBlock(ex.code) : '');
    choices(w, ex.choices, ex.answer, show, i => {
      const ok = i === ex.answer;
      const box = c => `<div class="choice">${show(c)}</div>`;
      finish(ok, feedback(ok, {
        correct: box(ex.choices[ex.answer]), yours: box(ex.choices[i]),
        yoursWhy: ex.wrong && ex.wrong[i], why: ex.why
      }));
    });
  };

  // predict: pick the exact output, or type it when ex.typed holds the answer.
  R.predict = (ex, root, finish) => {
    const w = add(root, codeBlock(ex.code) +
      (ex.input != null ? `<div class="label">Input</div>${outBlock(ex.input)}` : ''));
    if (ex.typed != null) {
      const f = add(w, `<input class="typed" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Type the exact output">
        <p class="dim">Exact match: every space and symbol counts.</p>
        <button class="btn primary">Check</button>`);
      const inp = f.querySelector('input'), btn = f.querySelector('button');
      btn.onclick = () => {
        const v = straightQuotes(inp.value);
        const ok = v === ex.typed;
        inp.setAttribute('value', inp.value);
        inp.disabled = btn.disabled = true;
        finish(ok, feedback(ok, { correct: outBlock(ex.typed), yours: outBlock(v), yoursWhy: ex.wrongTyped, why: ex.why }));
      };
      return;
    }
    const show = t => `<span class="cc out">${vis(t)}</span>`;
    choices(w, ex.choices, ex.answer, show, i => {
      const ok = i === ex.answer;
      finish(ok, feedback(ok, {
        correct: outBlock(ex.choices[ex.answer]), yours: outBlock(ex.choices[i]),
        yoursWhy: ex.wrong && ex.wrong[i], why: ex.why
      }));
    });
  };

  // fill: tap a blank (or let it auto-advance), then tap a chip from the word bank.
  R.fill = (ex, root, finish) => {
    const n = ex.blanks.length, got = Array(n).fill(null);
    const accepts = i => [].concat(ex.blanks[i]);
    const bank = shuffle(ex.bank);
    let active = 0;
    let html = hl(ex.code);
    for (let i = 0; i < n; i++) html = html.replace(`__${i}__`, `<button class="blank" data-b="${i}"></button>`);
    const w = add(root, `<pre class="code">${html}</pre>
      <div class="bank">${bank.map((t, i) => `<button class="chip" data-i="${i}">${esc(t)}</button>`).join('')}</div>
      <button class="btn primary check" disabled>Check</button>`);
    const blanks = [...w.querySelectorAll('.blank')], chips = [...w.querySelectorAll('.chip')], check = w.querySelector('.check');
    const paint = () => {
      blanks.forEach((b, i) => {
        b.textContent = got[i] == null ? ' ' : got[i];
        b.classList.toggle('active', i === active);
        b.classList.toggle('filled', got[i] != null);
      });
      check.disabled = got.some(g => g == null);
    };
    blanks.forEach((b, i) => b.onclick = () => { got[i] = null; active = i; paint(); });
    chips.forEach(c => c.onclick = () => {
      if (active < 0) return;
      got[active] = bank[+c.dataset.i];
      active = got.findIndex(g => g == null);
      paint();
    });
    check.onclick = () => {
      const right = got.map((g, i) => accepts(i).includes(g));
      const ok = right.every(Boolean);
      active = -1;
      paint();
      blanks.forEach((b, i) => { b.disabled = true; b.classList.add(right[i] ? 'right' : 'wrong'); });
      chips.forEach(c => c.disabled = true);
      check.disabled = true;
      let solved = hl(ex.code);
      for (let i = 0; i < n; i++) solved = solved.replace(`__${i}__`, `<mark>${esc(accepts(i)[0])}</mark>`);
      const notes = got.map((g, i) => right[i] ? '' :
        `Blank ${i + 1}: you picked \`${g}\`, it should be \`${accepts(i)[0]}\`.` +
        ((ex.wrong && (ex.wrong[`${i}:${g}`] || ex.wrong[g])) ? ' ' + (ex.wrong[`${i}:${g}`] || ex.wrong[g]) : '')
      ).filter(Boolean).join('\n');
      finish(ok, feedback(ok, { correct: `<pre class="code">${solved}</pre>`, yoursWhy: notes, why: ex.why }));
    };
    paint();
  };

  // order (Parsons): tap lines from the pool to build the program; braces auto-indent.
  R.order = (ex, root, finish) => {
    const lines = ex.lines.map(l => l.trim());
    const target = lines.join('\n');
    let pool = lines.map((_, i) => i);
    do pool = shuffle(pool); while (lines.length > 2 && pool.map(i => lines[i]).join('\n') === target);
    const placed = [];
    const w = add(root, `<div class="label">Your program</div><div class="placed"></div>
      <div class="label">Tap the lines in order (tap a placed line to send it back)</div><div class="pool"></div>
      <div class="row"><button class="btn clear">Clear</button><button class="btn primary check" disabled>Check</button></div>`);
    const $placed = w.querySelector('.placed'), $pool = w.querySelector('.pool');
    const check = w.querySelector('.check'), clear = w.querySelector('.clear');
    const depths = idxs => {
      let d = 0;
      return idxs.map(i => {
        const t = lines[i];
        if (t.startsWith('}')) d = Math.max(0, d - 1);
        const r = { i, d };
        if (t.endsWith('{')) d++;
        return r;
      });
    };
    const paint = () => {
      $placed.innerHTML = placed.length
        ? depths(placed).map(({ i, d }, k) => `<button class="oline" data-k="${k}" style="padding-left:${0.75 + d * 1.5}em">${hl(lines[i])}</button>`).join('')
        : '<div class="empty">Tap lines below to build the program here.</div>';
      $pool.innerHTML = pool.map((i, k) => `<button class="pline" data-k="${k}">${hl(lines[i])}</button>`).join('');
      $placed.querySelectorAll('.oline').forEach(b => b.onclick = () => { pool.push(...placed.splice(+b.dataset.k, 1)); paint(); });
      $pool.querySelectorAll('.pline').forEach(b => b.onclick = () => { placed.push(...pool.splice(+b.dataset.k, 1)); paint(); });
      check.disabled = pool.length > 0;
    };
    clear.onclick = () => { pool.push(...placed.splice(0)); paint(); };
    check.onclick = () => {
      const got = placed.map(i => lines[i]);
      const ok = got.join('\n') === target;
      const firstBad = got.findIndex((t, k) => t !== lines[k]);
      w.querySelectorAll('button').forEach(b => b.disabled = true);
      if (!ok) $placed.querySelectorAll('.oline')[firstBad].classList.add('wrong');
      const pretty = depths(lines.map((_, i) => i)).map(({ i, d }) => '   '.repeat(d) + lines[i]).join('\n');
      finish(ok, feedback(ok, {
        correct: codeBlock(pretty),
        yoursWhy: ok ? '' : `First wrong spot is line ${firstBad + 1}: you put \`${got[firstBad]}\` where \`${lines[firstBad]}\` goes.`,
        why: ex.why
      }));
    };
    paint();
  };

  // bug: tap the broken line, pick the fix, pick what Java would report.
  R.bug = (ex, root, finish) => {
    const lines = ex.code.split('\n');
    const bad = [].concat(ex.line);
    const w = add(root, `<div class="label">Step 1 · Tap the broken line</div>
      <div class="buglines"><div class="bl-inner">${lines.map((l, i) => `<button class="bugline" data-i="${i}">${hl(l) || ' '}</button>`).join('')}</div></div>
      <div class="bugsteps"></div>`);
    const steps = w.querySelector('.bugsteps');
    const btns = [...w.querySelectorAll('.bugline')];
    const res = {};
    const text = c => `<span class="ct">${md(c)}</span>`;
    btns.forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      res.line = bad.includes(i);
      btns.forEach(x => {
        x.disabled = true;
        const j = +x.dataset.i;
        if (bad.includes(j)) x.classList.add('right');
        else if (j === i) x.classList.add('wrong');
      });
      const s2 = add(steps, `<div class="label">Step 2 · Pick the fix</div>`);
      choices(s2, ex.fixes, ex.fix, text, f => {
        res.fix = f === ex.fix;
        const s3 = add(steps, `<div class="label">Step 3 · What happens with the bug in place?</div>`);
        choices(s3, ex.errors, ex.error, text, e => {
          res.err = e === ex.error;
          const ok = res.line && res.fix && res.err;
          const mark = v => v ? '✓' : '✗';
          finish(ok, feedback(ok, {
            extra: `<ul class="steplist">
              <li>${mark(res.line)} Broken line: <code>${esc(lines[bad[0]].trim())}</code></li>
              <li>${mark(res.fix)} Fix: ${md(ex.fixes[ex.fix])}</li>
              <li>${mark(res.err)} Result: ${md(ex.errors[ex.error])}</li></ul>`,
            why: ex.why
          }));
        });
      });
    });
  };

  // cold: type from memory; compared token by token against the accepted answers.
  const tokens = src => (straightQuotes(src).match(/"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|\/\/[^\n]*|\/\*[\s\S]*?\*\/|\w+|\S/g) || [])
    .filter(t => !t.startsWith('//') && !t.startsWith('/*'));
  const norm = src => tokens(src).join(' ');
  const rowsOf = src => src.split('\n').map(raw => ({ n: norm(raw), raw: raw.trim() })).filter(r => r.n);

  function diff(a, b) {
    const m = a.length, n = b.length;
    const L = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--)
      L[i][j] = a[i].n === b[j].n ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const rows = [];
    let i = 0, j = 0;
    while (i < m && j < n) {
      if (a[i].n === b[j].n) { rows.push([' ', b[j].raw]); i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) rows.push(['-', a[i++].raw]);
      else rows.push(['+', b[j++].raw]);
    }
    while (i < m) rows.push(['-', a[i++].raw]);
    while (j < n) rows.push(['+', b[j++].raw]);
    return { rows, score: L[0][0] };
  }

  R.cold = (ex, root, finish) => {
    const ctx = ex.context ? hl(ex.context).replace('@@', '<span class="slot">▮ your code here</span>') : '';
    const w = add(root, `${ctx ? `<pre class="code">${ctx}</pre>` : ''}
      <textarea class="cold" rows="${ex.rows || 8}" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Type it from memory…"></textarea>
      <p class="note">Self-check, not a real compiler. Spacing, indentation and line breaks are ignored. Spelling, capital letters and punctuation are not.</p>
      <div class="row"><button class="btn reveal">Show answer</button><button class="btn primary check">Check</button></div>`);
    const ta = w.querySelector('textarea');
    const done = gaveUp => {
      const text = ta.value;
      const mine = rowsOf(text);
      const best = ex.accept
        .map(a => ({ a, ok: norm(a) === norm(text), d: diff(rowsOf(a), mine) }))
        .sort((x, y) => (y.ok - x.ok) || (y.d.score - x.d.score))[0];
      const ok = !gaveUp && best.ok;
      const frozen = document.createElement('pre');
      frozen.className = 'code';
      frozen.textContent = text || '(nothing typed)';
      ta.replaceWith(frozen);
      w.querySelectorAll('button').forEach(b => b.disabled = true);
      const diffHtml = !ok && text.trim()
        ? `<div class="label">Diff: − expected, + yours</div><pre class="diff">${best.d.rows
          .map(([k, t]) => `<span class="${k === '-' ? 'dm' : k === '+' ? 'dp' : ''}">${k} ${esc(t)}</span>`).join('')}</pre>`
        : '';
      finish(ok, feedback(ok, { correct: codeBlock(best.a), extra: diffHtml, why: ex.why }));
    };
    w.querySelector('.check').onclick = () => done(false);
    w.querySelector('.reveal').onclick = () => done(true);
  };

  // One standalone exercise (used by the Weird Rules quizzes).
  function one(ex, root, cb) {
    root.innerHTML = `<p class="q">${md(ex.q)}</p>`;
    R[ex.type](ex, root, (ok, fb) => { root.insertAdjacentHTML('beforeend', fb); cb(ok); });
  }

  // A session: items are { ex, id, pid } or { ex, rid } with an optional `from` label.
  // opts: onAnswer(item, ok), onFinish(results) -> extra summary HTML, retake(items), restart(), done()
  function run(root, items, opts) {
    const results = new Array(items.length).fill(null);
    let idx = 0;

    const score = () => {
      const done = results.filter(Boolean);
      return done.length ? `${done.filter(r => r.ok).length}/${done.length} correct` : '';
    };

    function show() {
      const it = items[idx], r = results[idx];
      const last = idx === items.length - 1;
      root.innerHTML = `
        <div class="sess-head"><span>${idx + 1} of ${items.length} · ${LABELS[it.ex.type]}</span><span class="score">${score()}</span></div>
        <div class="bar"><i style="width:${100 * results.filter(Boolean).length / items.length}%"></i></div>
        <div class="ex"></div>
        <div class="sess-nav">
          <button class="btn prev"${idx === 0 ? ' disabled' : ''}>‹ Prev</button>
          <button class="btn exit">Exit</button>
          <button class="btn next${r ? ' primary' : ''}">${last ? 'Finish' : 'Next ›'}</button>
        </div>`;
      const box = root.querySelector('.ex');
      if (r) box.innerHTML = r.review;
      else {
        box.innerHTML = `${it.from ? `<div class="from">${esc(it.from)}</div>` : ''}<p class="q">${md(it.ex.q)}</p>`;
        R[it.ex.type](it.ex, box, (ok, fb) => {
          box.insertAdjacentHTML('beforeend', fb);
          results[idx] = { ok, review: box.innerHTML };
          opts.onAnswer(it, ok);
          root.querySelector('.score').textContent = score();
          root.querySelector('.bar i').style.width = `${100 * results.filter(Boolean).length / items.length}%`;
          root.querySelector('.next').classList.add('primary');
          const fbEl = box.querySelector('.fb');
          if (fbEl && fbEl.scrollIntoView) fbEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
      root.querySelector('.prev').onclick = () => { idx--; show(); window.scrollTo(0, 0); };
      root.querySelector('.next').onclick = () => { if (last) finish(); else { idx++; show(); window.scrollTo(0, 0); } };
      root.querySelector('.exit').onclick = finish;
    }

    function finish() {
      const extra = opts.onFinish(results) || '';
      const done = results.filter(Boolean), right = done.filter(r => r.ok).length;
      const missed = items.filter((_, i) => !results[i] || !results[i].ok);
      const skipped = items.length - done.length;
      root.innerHTML = `<div class="card summary">
        <div class="bigscore">${right} / ${items.length}</div>
        <p class="dim">${done.length ? Math.round(100 * right / done.length) : 0}% of the ones you answered${skipped ? ` · ${skipped} skipped` : ''}</p>
        ${extra}
        ${missed.length
          ? `<h3>Missed or skipped</h3><ul>${missed.map(it => `<li><b>${esc(LABELS[it.ex.type])}</b>${it.from ? ` · ${esc(it.from)}` : ''}: ${md(it.ex.q)}</li>`).join('')}</ul>`
          : '<p>Clean sweep. Nice.</p>'}
        <div class="row" style="justify-content:center">
          ${missed.length ? '<button class="btn primary" data-a="retake">Retake missed only</button>' : ''}
          <button class="btn" data-a="restart">Start over</button>
          <button class="btn" data-a="done">Done</button>
        </div></div>`;
      root.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
        window.scrollTo(0, 0);
        if (b.dataset.a === 'retake') opts.retake(missed);
        else if (b.dataset.a === 'restart') opts.restart();
        else opts.done();
      });
      window.scrollTo(0, 0);
    }

    show();
  }

  window.Ex = { LABELS, run, one, tokens };
})();
