# D286 Java Trainer

A mobile-first, offline study app for WGU D286 Java Fundamentals: 14 exam problems with
walkthroughs and practice, plus Weird Rules, an Error Decoder and an Instruction Decoder.
Plain HTML/CSS/JavaScript with no build step. Progress is saved in the browser (`localStorage`).

## Run it locally

From this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly also works, but offline
mode (the service worker) only runs when the app is served over http(s).

## Put it on your iPhone

Safari needs the app served over **HTTPS** to keep working offline. After the app is hosted
(for example on GitHub Pages), open the link in Safari, tap **Share → Add to Home Screen**,
and open it once while online. After that it works with no connection.

## Check content after editing

```bash
node tools/check.js
```

This confirms every solution still matches `HANDOFF.md` character for character, every
sample output appears in `HANDOFF.md`, and every exercise is well formed (valid answers,
a "why it's wrong" for each wrong choice, blanks present in the word bank, and so on).

## Where content lives

- `content/problems.js`: the 14 problems, one `{ ... }` block each.
- `content/reference.js`: Weird Rules (each with a quiz), the Error Decoder and the Instruction Decoder.

Code goes between `` j` `` and `` ` ``. It is used exactly as written, backslashes included,
so `"\n"` stays `\n`. In plain-text fields, wrap code in single backticks (`` `like this` ``)
and use `**bold**` for emphasis.

### Problem fields

| Field | What it is |
|---|---|
| `statement` | Problem text. Blank line = new paragraph; lines starting `- ` become a list. |
| `note` | Optional yellow warning shown under the statement. |
| `verifyStatement` / `verifyTemplate` | `true` shows a "check wording in zyBooks" flag. |
| `samples` | `[{ input, output }]`. Outputs must match exactly, ending in `\n`. |
| `files` | Template files. `code` with `@@0@@`, `@@1@@`… marks the parts you write; or `summary` (plus optional `snippet`) for given files. |
| `fill` | The code that goes in each `@@n@@` slot, in order. |
| `solution` | The verified solution, exactly as in `HANDOFF.md`. |
| `steps` | Walkthrough: `{ code, say, py }` (`py` = optional Python equivalent). |
| `trace` | Optional `{ note, cols, rows }` table. |
| `python` | Optional `{ java, py, note }` side-by-side. |
| `analogy`, `concepts`, `mistakes` | Walkthrough extras. |
| `exercises` | At least 6; see below. |

### Exercise types

Every exercise has `type`, `q` (the question) and usually `why` (shown after answering).
For choice-based types, `wrong` maps a choice's index to why that choice is wrong.

- `fill`: `code` with `__0__`, `__1__`… blanks; `blanks` (answers in order, or an array of accepted answers); `bank` (chips to tap); `wrong` keyed by chip text or `"blankIndex:chip"`.
- `order`: `lines` in the correct order. Indentation is added automatically from the braces.
- `predict`: `code`, optional `input`, then either `choices` + `answer`, or `typed: "exact one-line output"`.
- `bug`: `code`; `line` (0-based index of the broken line, or an array of them); `fixes` + `fix`; `errors` + `error`.
- `header` / `pick`: `choices` + `answer`. Add `plain: true` for text answers, or `ws: true` to show spaces as `·`.
- `cold`: `accept` (accepted answers; the first is shown as the answer); optional `context` with `@@` where the typed code goes. Spacing and line breaks are ignored when checking.

Changing the order or number of exercises in a problem can mix up its practice history,
since history is stored by exercise position.

## How progress works

- **Learning**: you've answered at least one exercise.
- **Passed with help**: 80% or better on a full practice run.
- **Passed cold**: 80% or better on a full **Cold redo** run.
- **Cold redo due**: passed (with help or cold), not passed cold in the last 24 hours, and not practiced yet today.
- **Practice weak spots** pulls the exercises and rule quizzes you miss most, then tops up from your lowest-accuracy problems.

Reset everything from the Progress tab.

## After changing files

`sw.js` serves cached files first and refreshes them in the background, so edits show up
on the second open. If you add or rename a file, add it to the `FILES` list in `sw.js` and
bump `CACHE` (for example `d286-v2`).
