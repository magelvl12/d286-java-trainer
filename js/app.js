// Screens and hash routing.
(function () {
  const { esc, hl, vis, md, block } = window.H;
  const P = window.PROBLEMS, REF = window.REFERENCE;
  const view = document.getElementById('view');
  const $ = (s, r = document) => r.querySelector(s);

  const STATUS = { new: 'Not started', learning: 'Learning', helped: 'Passed with help', cold: 'Passed cold' };
  const badge = id => { const s = Store.prob(id).status; return `<span class="badge st-${s}">${STATUS[s]}</span>`; };
  const accText = id => { const a = Store.accuracy(id); return a == null ? '—' : `${a}%`; };
  const verifyNote = what => `<div class="verify">⚠ This ${what} was reconstructed from notes. Check the wording in zyBooks.</div>`;

  function ago(ts) {
    if (!ts) return 'never';
    const m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    if (m < 60 * 24) return `${Math.round(m / 60)}h ago`;
    return `${Math.round(m / 1440)}d ago`;
  }

  function chrome(title, back, tab) {
    $('#title').textContent = title;
    const b = $('#back');
    b.hidden = !back;
    b.onclick = () => { location.hash = back; };
    document.querySelectorAll('#tabbar a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
    document.title = title === 'D286 Java Trainer' ? title : `${title} · D286`;
  }

  function route() {
    const [a, b, c] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    window.scrollTo(0, 0);
    if (a === 'p') return problem(+b, c || 'problem');
    if (a === 'practice') return practice(+b, c);
    if (a === 'weak') return weak();
    if (a === 'rules') return rules();
    if (a === 'errors') return errors();
    if (a === 'decode') return decoder();
    if (a === 'progress') return progress();
    home();
  }

  // ---------- home ----------

  function weakestProblems(n) {
    return P.filter(p => Store.prob(p.id).answered > 0)
      .sort((x, y) => Store.accuracy(x.id) - Store.accuracy(y.id))
      .filter(p => Store.accuracy(p.id) < 100)
      .slice(0, n);
  }

  const pitem = p => `<a class="pitem" href="#/p/${p.id}">
      <span class="num">${p.id}</span>
      <span class="pt"><b>${esc(p.title)}</b><small>${esc(p.topic)} · ${accText(p.id)}</small></span>
      ${badge(p.id)}</a>`;

  function home() {
    chrome('D286 Java Trainer', null, 'home');
    const due = Store.coldDue(P);
    const weakest = weakestProblems(3);
    view.innerHTML = `
      <div class="hero-grid">
        <a class="card go" href="#/weak"><b>Practice weak spots</b>
          <span>Up to 10 exercises from what you miss most, across problems and Weird Rules.</span></a>
        <div class="card"><b>Cold redo due</b>
          <div class="duelist">${due.length
            ? due.map(p => `<a href="#/practice/${p.id}/cold">${p.id}. ${esc(p.title)}</a>`).join('')
            : '<p class="dim">Nothing due. Pass a problem with help, then come back tomorrow for a cold redo.</p>'}</div></div>
      </div>
      ${weakest.length ? `<h2>Weakest problems</h2><div class="chips">${weakest
        .map(p => `<a class="chiplink" href="#/p/${p.id}/practice">${p.id}. ${esc(p.title)} · ${accText(p.id)}</a>`).join('')}</div>` : ''}
      <h2>The 14 problems</h2>
      <div class="plist">${P.map(pitem).join('')}</div>`;
  }

  // ---------- problem page ----------

  function problem(id, tab) {
    const p = P.find(x => x.id === id);
    if (!p) return home();
    chrome(`${p.id}. ${p.title}`, '#/', 'home');
    const tabs = [['problem', 'Problem'], ['template', 'Template'], ['walk', 'Walkthrough'], ['practice', 'Practice']];
    view.innerHTML = `<nav class="seg">${tabs.map(([k, l]) =>
      `<a href="#/p/${id}/${k}" class="${k === tab ? 'on' : ''}">${l}</a>`).join('')}</nav><div id="tab"></div>`;
    const draw = { problem: tabProblem, template: tabTemplate, walk: tabWalk, practice: tabPractice }[tab] || tabProblem;
    draw(p, $('#tab'));
  }

  function tabProblem(p, box) {
    const ws = Store.prefs.ws;
    const out = t => `<pre class="out">${ws ? vis(t) : esc(t)}</pre>`;
    box.innerHTML = `
      ${p.verifyStatement ? verifyNote('problem statement') : ''}
      <div class="prose">${block(p.statement)}</div>
      ${p.note ? `<div class="verify">${md(p.note)}</div>` : ''}
      <button class="toggle" id="ws">${ws ? 'Hide' : 'Show'} spaces (·) and newlines (⏎)</button>
      ${p.samples.map((s, i) => `
        <h3>${p.samples.length > 1 ? `Sample ${i + 1}` : 'Sample'}</h3>
        <div class="io">
          <div><div class="label">Input</div>${s.input ? out(s.input) : '<p class="dim">(no input)</p>'}</div>
          <div><div class="label">Expected output</div>${out(s.output)}</div>
        </div>`).join('')}`;
    $('#ws', box).onclick = () => { Store.setPref('ws', !ws); tabProblem(p, box); };
  }

  function fileBlock(f, p, show) {
    const yours = !!(f.code && f.code.includes('@@'));
    const head = `<div class="file-head"><span class="mono">${esc(f.name)}</span>
      <span class="badge ${yours ? 'st-you' : ''}">${yours ? 'you write in here' : 'given'}</span></div>`;
    const note = f.note ? `<p class="dim">${md(f.note)}</p>` : '';
    if (!f.code) {
      return `<div class="file">${head}${note}<div class="prose">${block(f.summary)}</div>
        ${f.snippet ? `<pre class="code">${hl(f.snippet)}</pre>` : ''}</div>`;
    }
    const lines = [];
    f.code.split('\n').forEach(line => {
      const m = line.match(/^(\s*)@@(\d+)@@$/);
      if (!m) { lines.push(`<span class="line">${hl(line)}</span>`); return; }
      const part = show ? p.fill[+m[2]] : (f.placeholder || '/* Type your code here. */');
      part.split('\n').forEach(l => lines.push(`<span class="line mine">${l ? hl(m[1] + l) : ''}</span>`));
    });
    return `<div class="file">${head}${note}<pre class="code"><span class="lines">${lines.join('')}</span></pre></div>`;
  }

  function tabTemplate(p, box) {
    let show = true;
    const draw = () => {
      box.innerHTML = `
        ${p.verifyTemplate ? verifyNote('template') : ''}
        <p class="dim">The highlighted lines are what you write. Everything else is given. Comments in your real template may differ.</p>
        <button class="toggle" id="mine">${show ? 'Hide my part (self-test)' : 'Show my part'}</button>
        ${p.files.map(f => fileBlock(f, p, show)).join('')}`;
      $('#mine', box).onclick = () => { show = !show; draw(); };
    };
    draw();
  }

  function tabWalk(p, box) {
    let n = 0;
    const h = t => `<h3>${++n}. ${t}</h3>`;
    box.innerHTML = `
      ${h('The whole solution')}
      <pre class="code">${hl(p.solution)}</pre>
      ${h('Line by line')}
      <div class="steps">${p.steps.map(s => `
        <div class="step">
          <pre class="code">${hl(s.code)}</pre>
          <div class="say"><p>${md(s.say)}</p>${s.py ? `<div class="py"><div class="label">Python</div><pre class="code pyc">${hl(s.py, 'python')}</pre></div>` : ''}</div>
        </div>`).join('')}</div>
      ${p.trace ? `${h('Trace it with the sample input')}
        ${p.trace.note ? `<p>${md(p.trace.note)}</p>` : ''}
        <div class="tablewrap"><table class="trace"><thead><tr>${p.trace.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${p.trace.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
      ${p.python ? `${h('Java vs Python')}
        <div class="vs"><div><div class="label">Java</div><pre class="code">${hl(p.python.java)}</pre></div>
        <div><div class="label">Python</div><pre class="code pyc">${hl(p.python.py, 'python')}</pre></div></div>
        <p>${md(p.python.note)}</p>` : ''}
      ${p.analogy ? `<div class="analogy"><b>Picture it</b><p>${md(p.analogy)}</p></div>` : ''}
      ${h('Key ideas')}
      <ul>${p.concepts.map(c => `<li>${md(c)}</li>`).join('')}</ul>
      ${h('Your past mistakes')}
      <ul class="mistakes">${p.mistakes.map(c => `<li>${md(c)}</li>`).join('')}</ul>
      <a class="btn primary block" href="#/p/${p.id}/practice">Now practice it</a>`;
  }

  function tabPractice(p, box) {
    const s = Store.prob(p.id);
    const counts = {};
    p.exercises.forEach(e => { counts[e.type] = (counts[e.type] || 0) + 1; });
    box.innerHTML = `
      <div class="card">
        <div>${badge(p.id)}</div>
        <p class="dim">Accuracy ${accText(p.id)} · ${s.sessions} session${s.sessions === 1 ? '' : 's'} · last practiced ${ago(s.last)}${s.coldAt ? ` · last cold pass ${ago(s.coldAt)}` : ''}</p>
      </div>
      <p>${p.exercises.length} exercises: ${Object.entries(counts).map(([t, c]) => `${c} × ${Ex.LABELS[t].toLowerCase()}`).join(', ')}.</p>
      <a class="btn primary block" href="#/practice/${p.id}">Start practice</a>
      <p class="dim">Score 80% or better on a full run to reach <b>Passed with help</b>. Use the walkthrough as much as you like.</p>
      <a class="btn block" href="#/practice/${p.id}/cold">Cold redo</a>
      <p class="dim">Same exercises, but don't open the walkthrough first. Best done the next day. 80% or better marks it <b>Passed cold</b>.</p>`;
  }

  // ---------- sessions ----------

  function startSession(items, o) {
    Ex.run(view, items, {
      onAnswer: (it, ok) => Store.answer(it, ok),
      onFinish: results => {
        if (!o.pid || (o.mode !== 'practice' && o.mode !== 'cold')) return '';
        const done = results.filter(Boolean);
        const before = Store.prob(o.pid).status;
        const after = Store.finishSession(o.pid, o.mode, done.filter(r => r.ok).length, done.length, items.length);
        if (done.length < items.length) return '<p class="dim">Answer every exercise in one run for it to count toward your status.</p>';
        return after !== before ? `<p>Status: ${badge(o.pid)} (new!)</p>` : `<p>Status: ${badge(o.pid)}</p>`;
      },
      retake: missed => startSession(missed, Object.assign({}, o, { mode: 'retake' })),
      restart: () => startSession(items, o),
      done: () => { location.hash = o.back; }
    });
  }

  function practice(id, mode) {
    const p = P.find(x => x.id === id);
    if (!p) return home();
    const cold = mode === 'cold';
    chrome(`${p.id}. ${cold ? 'Cold redo' : 'Practice'}`, `#/p/${id}/practice`, 'home');
    const items = p.exercises.map((ex, i) => ({ ex, id: `p${id}-${i}`, pid: id }));
    startSession(items, { pid: id, mode: cold ? 'cold' : 'practice', back: `#/p/${id}/practice` });
  }

  // Missed exercises and rule quizzes, worst first, topped up from the weakest problems.
  function weakItems(max = 10) {
    const rate = s => (s.wrong + 1) / (s.seen + 2);
    const items = [];
    P.forEach(p => p.exercises.forEach((ex, i) => {
      const id = `p${p.id}-${i}`, s = Store.exStat(id);
      if (s.wrong) items.push({ ex, id, pid: p.id, from: `Problem ${p.id}: ${p.title}`, w: rate(s) });
    }));
    REF.rules.forEach((r, i) => {
      const rid = `rule-${i}`, s = Store.ruleStat(rid);
      if (s.wrong) items.push({ ex: r.quiz, rid, from: `Weird Rule ${i + 1}`, w: rate(s) });
    });
    items.sort((a, b) => b.w - a.w);
    const pick = items.slice(0, max);
    for (const p of weakestProblems(14)) {
      p.exercises.forEach((ex, i) => {
        const id = `p${p.id}-${i}`;
        if (pick.length < max && !pick.some(it => it.id === id)) pick.push({ ex, id, pid: p.id, from: `Problem ${p.id}: ${p.title}` });
      });
    }
    return pick;
  }

  function weak() {
    chrome('Weak spots', '#/', 'home');
    const items = weakItems();
    if (!items.length) {
      view.innerHTML = `<div class="card"><p>No weak spots yet. Practice a problem or quiz yourself on the Weird Rules, and anything you miss collects here.</p>
        <a class="btn primary" href="#/p/1">Start with Problem 1</a></div>`;
      return;
    }
    startSession(items, { mode: 'weak', back: '#/' });
  }

  // ---------- reference screens ----------

  function rules() {
    chrome('Weird Rules', null, 'rules');
    view.innerHTML = `<p class="dim">Java gotchas that cost exam points. Open a rule, then tap "Quiz me". A red dot means you missed that quiz before.</p>
      ${REF.rules.map((r, i) => `
        <details class="card rule"><summary><span class="num">${i + 1}</span><span>${md(r.title)}</span>${Store.ruleStat(`rule-${i}`).wrong ? '<span class="missdot"></span>' : ''}</summary>
          <div class="prose">${block(r.text)}</div>
          ${r.code ? `<pre class="code">${hl(r.code)}</pre>` : ''}
          <button class="btn quizbtn" data-i="${i}">Quiz me</button><div class="quiz"></div>
        </details>`).join('')}`;
    view.querySelectorAll('.quizbtn').forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      b.hidden = true;
      Ex.one(REF.rules[i].quiz, b.nextElementSibling, ok => Store.answer({ rid: `rule-${i}` }, ok));
    });
  }

  function errors() {
    chrome('Error Decoder', null, 'errors');
    view.innerHTML = `<input class="search" type="search" placeholder="Type part of the error message…" autocapitalize="off" autocorrect="off">
      <div id="elist">${REF.errors.map(e => `
        <div class="card err">
          <pre class="msg">${esc(e.msg)}</pre>
          <div class="label">What it means</div><p>${md(e.meaning)}</p>
          <div class="label">Usual fix</div><p>${md(e.fix)}</p>
          ${e.example ? `<div class="label">Example</div><pre class="code">${hl(e.example)}</pre>` : ''}
          ${e.seen ? `<p class="dim">You hit this in ${md(e.seen)}</p>` : ''}
        </div>`).join('')}</div>
      <h2>Three kinds of errors</h2>
      ${REF.errorKinds.map(k => `<div class="card"><b>${esc(k.name)}</b><p>${md(k.text)}</p></div>`).join('')}`;
    const cards = [...view.querySelectorAll('.err')];
    $('.search', view).oninput = e => {
      const q = e.target.value.toLowerCase().trim();
      cards.forEach(c => { c.hidden = q && !c.textContent.toLowerCase().includes(q); });
    };
  }

  function decoder() {
    chrome('Instruction Decoder', null, 'decode');
    view.innerHTML = `<p class="dim">Exam wording on the left, the Java it means on the right.</p>
      ${REF.decoder.map(d => `<div class="card">
        <div class="label">Exam says</div><p class="says">“${md(d.says)}”</p>
        <div class="label">You write</div><pre class="code">${hl(d.write)}</pre>
        ${d.note ? `<p class="dim">${md(d.note)}</p>` : ''}
      </div>`).join('')}`;
  }

  function progress() {
    chrome('Progress', null, 'progress');
    const due = Store.coldDue(P);
    const missedRules = REF.rules.map((r, i) => ({ r, i, s: Store.ruleStat(`rule-${i}`) })).filter(x => x.s.wrong);
    view.innerHTML = `
      <h2>Cold redo due</h2>
      <div class="card">${due.length
        ? `<div class="duelist">${due.map(p => `<a href="#/practice/${p.id}/cold">${p.id}. ${esc(p.title)}</a>`).join('')}</div>`
        : '<p class="dim">Nothing due. A problem shows up here the day after you pass it with help, and again whenever you haven\'t passed it cold in 24 hours.</p>'}</div>
      <h2>Problems</h2>
      <div class="card ptable">${P.map(p => {
        const s = Store.prob(p.id);
        return `<a class="prow" href="#/p/${p.id}/practice"><span class="num">${p.id}</span><b>${esc(p.title)}</b>${badge(p.id)}
          <small>${s.sessions} session${s.sessions === 1 ? '' : 's'} · ${s.answered} answers · accuracy ${accText(p.id)} · last ${ago(s.last)}</small></a>`;
      }).join('')}</div>
      ${missedRules.length ? `<h2>Weird Rules you've missed</h2><div class="card">${missedRules
        .map(x => `<p>${x.i + 1}. ${md(x.r.title)} <span class="dim">· missed ${x.s.wrong} of ${x.s.seen}</span></p>`).join('')}</div>` : ''}
      <h2>Reset</h2>
      <button class="btn" id="reset">Erase all progress</button>`;
    $('#reset', view).onclick = () => {
      if (confirm('Erase all progress? This cannot be undone.')) { Store.reset(); progress(); }
    };
  }

  window.addEventListener('hashchange', route);
  route();
})();
