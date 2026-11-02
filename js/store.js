// Progress lives in localStorage under one key. If storage is blocked or cleared the
// app just starts fresh; nothing else depends on it.
(function () {
  const KEY = 'd286-progress-v1';
  const DAY = 24 * 3600e3;
  const PASS = 0.8;

  const blank = () => ({ problems: {}, ex: {}, rules: {}, prefs: { ws: false } });
  let state = load();

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.problems) return Object.assign(blank(), s);
    } catch (e) { /* fall through */ }
    return blank();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  function prob(id) {
    return state.problems[id] || (state.problems[id] = {
      status: 'new', sessions: 0, answered: 0, correct: 0, last: null, helpedAt: null, coldAt: null
    });
  }
  const stat = (bucket, id) => bucket[id] || (bucket[id] = { seen: 0, wrong: 0 });

  const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };

  window.Store = {
    prob,
    exStat: id => stat(state.ex, id),
    ruleStat: id => stat(state.rules, id),
    get prefs() { return state.prefs; },
    setPref(k, v) { state.prefs[k] = v; save(); },

    // item is a session item: { id, pid } for problem exercises, { rid } for rule quizzes.
    answer(item, ok) {
      const s = item.rid ? stat(state.rules, item.rid) : stat(state.ex, item.id);
      s.seen++;
      if (!ok) s.wrong++;
      if (item.pid) {
        const p = prob(item.pid);
        p.answered++;
        if (ok) p.correct++;
        p.last = Date.now();
        if (p.status === 'new') p.status = 'learning';
      }
      save();
    },

    // Only a complete run (every exercise answered) can change the status.
    finishSession(pid, mode, correct, answered, total) {
      const p = prob(pid);
      if (!answered) return p.status;
      p.sessions++;
      if (answered === total) {
        const passed = correct / total >= PASS;
        if (mode === 'cold') {
          if (passed) { p.status = 'cold'; p.coldAt = Date.now(); }
          else if (p.status === 'cold') p.status = 'helped';
        } else if (mode === 'practice' && passed && p.status !== 'cold') {
          p.status = 'helped';
          p.helpedAt = Date.now();
        }
      }
      save();
      return p.status;
    },

    accuracy(pid) {
      const p = prob(pid);
      return p.answered ? Math.round(100 * p.correct / p.answered) : null;
    },

    // Due: passed at least with help, not passed cold in the last 24 hours, and not
    // already practiced today (so a problem learned today comes back tomorrow).
    coldDue(problems) {
      const now = Date.now(), today = startOfToday();
      return problems.filter(x => {
        const p = prob(x.id);
        return (p.status === 'helped' || p.status === 'cold') &&
          (!p.coldAt || now - p.coldAt >= DAY) &&
          (!p.last || p.last < today);
      });
    },

    reset() { state = blank(); save(); }
  };
})();
