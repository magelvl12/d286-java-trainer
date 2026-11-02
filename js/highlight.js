// Minimal Java/Python syntax highlighter plus the small text helpers every screen uses.
(function () {
  const esc = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const JAVA_KW = new Set(('public private protected static void class extends implements new return if else ' +
    'while for do int double boolean char long float this super import final break continue').split(' '));
  const JAVA_LIT = new Set(['true', 'false', 'null']);
  const PY_KW = new Set('def return if elif else while for in class import from and or not pass break continue'.split(' '));
  const PY_LIT = new Set(['True', 'False', 'None', 'self']);
  const PY_BUILTIN = new Set(['print', 'input', 'int', 'float', 'str', 'len', 'range', 'list']);

  // Groups: 1 comment, 2 string, 3 char, 4 annotation, 5 number, 6 word
  const JAVA_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"?)|('(?:\\.|[^'\\\n])*'?)|(@\w+)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;
  const PY_RE = /(#[^\n]*)|("(?:\\.|[^"\\\n])*"?)|('(?:\\.|[^'\\\n])*'?)|(@\w+)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;

  function hl(code, lang) {
    const py = lang === 'python';
    const re = py ? PY_RE : JAVA_RE;
    code = String(code);
    re.lastIndex = 0;
    let out = '', last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      const t = m[0];
      let cls = '';
      if (m[1]) cls = 'c';
      else if (m[2] || m[3]) cls = 's';
      else if (m[4]) cls = 'a';
      else if (m[5]) cls = 'n';
      else if (py ? PY_KW.has(t) : JAVA_KW.has(t)) cls = 'k';
      else if (py ? PY_LIT.has(t) : JAVA_LIT.has(t)) cls = 'l';
      else if (py ? PY_BUILTIN.has(t) : /^[A-Z]/.test(t)) cls = 't';
      else if (code[re.lastIndex] === '(') cls = 'f';
      out += cls ? `<span class="${cls}">${esc(t)}</span>` : esc(t);
      last = re.lastIndex;
    }
    return out + esc(code.slice(last));
  }

  // Show spaces as · and newlines as ⏎ so exact output is visible.
  const vis = text => esc(text)
    .replace(/ /g, '<span class="ws">·</span>')
    .replace(/\n/g, '<span class="ws">⏎</span>\n');

  // Inline markup: `code` and **bold**.
  const md = s => esc(s == null ? '' : s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>');

  // Block markup: paragraphs split on blank lines; a block of "- " lines becomes a list.
  const block = s => String(s || '').split(/\n\s*\n/).map(b => {
    const lines = b.split('\n');
    if (lines.every(l => l.startsWith('- '))) return `<ul>${lines.map(l => `<li>${md(l.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${md(b)}</p>`;
  }).join('');

  window.H = { esc, hl, vis, md, block };
})();
