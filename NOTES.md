# NOTES — Monika's breitools

fmt: agent-only. telegraphic, no prose. `→` = cause → fix. `!` = don't do this + why.
git log = changelog (no DEVLOG). edit in place, never append.

## state
static multi-page PWA, no build step, no deps. vanilla HTML/CSS/JS.
host: GitHub Pages, repo github.com/mrlando/Breitools, branch main.
VERSION 44 (file `VERSION`, single int; index.html carries the same number as offline fallback).
pages: index.html (tool list) + sokkentool.html, schoenmaat.html, garenschatting.html, switchgewicht.html.
shared: style.css, common.js, version-check.js.
names: app "Monika's breitools", manifest short_name "Breitools". schoenmaat.html shows as "Sokmaat-range" (filename kept). sokkentool.html was sokmaat.html (git mv).
palette: --wool-rose #d98e94, --wool-lavender #a692b8, terracotta = main accent.
new tool = new .html + card in index.html `.tool-list` (multi-page, chosen 2026-07-10).

## build number
`.githooks/pre-commit` bumps VERSION +1 and patches `id="buildVersion"` in index.html, every commit, auto.
needs `git config core.hooksPath .githooks` per clone (set here).
! don't bump VERSION by hand — hook does it, you'd double-count.
! docs-only commit (NOTES.md etc): commit with `--no-verify`, else every PWA client force-reloads for nothing.
version-check.js `showVersion()` fills the `#buildVersion` span from the fetched VERSION; the literal in index.html is only the offline fallback. before showVersion existed the span was hardcoded and silently lagged (showed v36 while v39 was live).

## sok maths
euSizeToFootLength = EU × ⅔ − 1,5 cm. plain ⅔ overestimates 1,0–1,4 cm vs Ziengs tables; −1,5 brings it to ±0,6 cm over EU 36–50. footLengthToEuSize = inverse.
SIZE_TABLE (sokkentool.html ~106) = Regia 4-ply cast-on per EU size, bridges 22/23..46/47, linear interpolation between midpoints. unconfirmed whether Regia already assumes ~10% negative ease — photo of label had no notes.
size range: frac = euSize − floor; center = floor(euSize), +1 only if frac >= rangeSwitchThreshold (0.75); range = center ±1, always 3 wide. bias to smaller = knit fabric stretches.
! rangeSwitchThreshold logic is duplicated in sokkentool.html and schoenmaat.html — change both or the two tools disagree.
`.step-range-value` is `display: block` + `white-space: nowrap` + margin-top 4px: inline it broke across two lines at the en dash on narrow screens. used by sokkentool.html (step 5) and schoenmaat.html (steps 1 and 2); no full stop or space before the span, they dangle under the number.
footRounds = totalFootRows − heelRows − toeRounds. heelRows = turnsPerSide × 2 (German short row, no gusset).
heel/toe steps not shown (user does those unaided) but heelSts/centerSts/turnsPerSide/toeRounds still computed — footRounds needs them.
cast-on rounded to multiple of ribKnit+ribPurl (roundToMultiple). ease >= 100% = invalid.
in-the-round (leg/foot/toe) = rounds; heel = rows (flat).
manual round correction: `legTrim` (default 4) and `footTrim` (default 0), both subtract from stockinette only — legRows = max(legRowsExact − legTrim, cuffRows) so the rib never shrinks below the set cuff; footRounds = max(footRoundsExact − footTrim, 0). negatives clamp to 0 (iOS number keypad has no minus). heel and toe untouched. displayed cm stays the wanted length, not back-computed — that is the point; "(N rondjes correctie)" is appended to the step when > 0.
suggestedLegTrim = round((legLength − cuffLength) / 4) ≈ 1 round per 4 cm stockinette, calibrated on Broe's sock (15 cm stockinette → 4). hint `#legTrimHint` (.field-hint.suggestion) shows only when it differs from the entered value. foot gets no suggestion on purpose: it is nearly flat across sizes (4 from EU 38 up, 3 for 32-36) because a bigger size also grows the heel and toe.
open: leg and foot knit up longer than gauge predicts and the three measurements (rib exactly 42 rows/10cm, hand-counted stockinette also 42, measured section lengths implying ~38-40) cannot be reconciled. no root cause; the trim fields are the accepted workaround. footTrim went back to 0 once the banded-toe fix landed — it had been compensating for the toe error.
cuffRows + stockinetteRows = total leg length (cuff included, not added on top).
toe = Regia 4-ply banded toe ("bandteen" in Dutch — ! not "bandspits", that was an invented translation of Bandspitze). TOE_TABLE (~144) holds the per-cast-on cadence after the first decrease round (4x every 4th round, 3x every 3rd, 2x every 2nd, then every round); toeShaping() picks the nearest row, runs the phases, then decreases every round down to FINAL_TOE_STS = 4, with a guard so a cast-on outside the table (e.g. 1x1 rib) still lands exactly. sts check: all 13 table sizes reach 8 sts on the cadence, pattern then knits on to 4. rounds per cast-on: 44→15, 48→16, 52→19, 56→20, 60→24, 64→25, 68→27, 72→28.
! the old generic wedge toe gave 19 rounds at 60 sts vs the real 24 — that 5-round (1,2 cm) shortfall was the foot half of the measured length error.
step list shows the toe as a bare number ("24 rounds teen minderen — Bandteen tot 4 steken over — 5,7 cm"); the Regia needle cadence stays in the code, not on screen.

## known traps
`updateCircFromEuSize()` runs ONLY on the EU-size input. ! not on gauge/ease change → it divides ease out and multiplies it straight back, algebraically cancelling, so the ease slider silently does nothing (64 sts stayed 64 at 10% and 15%).
`circInput.value` keeps full precision. ! no `fmt()` on it → 1-decimal rounding fed back into calculate() flipped 60↔64 sts for the same EU size depending on input order. round once, at roundToMultiple.
`syncingSize` flag guards the EU↔footlength input listeners against an infinite loop.
glass seam: ::before/::after on a `backdrop-filter` element composite as their own layer → visible hairline at the edge. highlights are baked into stacked gradients in the `background` declaration on .glass/.result-card. ! no pseudo-elements there.
safe-area: `viewport-fit=cover` in the viewport meta of all 5 pages + `env(safe-area-inset-*)` on body, .scroll-top-btn, .back-link (.back-link top = calc(18px + inset-top), else under the clock).
page background lives on `html`, not `body` — body is max-width 420px and centred, so a body background leaves strips on wide phones.
iOS `inputmode="decimal"` has no return/done key → document-level click listener blurs the active INPUT.
@media (min-width: 700px): column 420px → 640px for iPad/landscape.

## caching
GitHub Pages serves max-age=600, not configurable on the free tier. PWA/homescreen cache held longer.
version-check.js: `checkVersion()` fetches VERSION with cache:'no-store', compares to localStorage, reloads with a `?_v=` bust then cleans it via history.replaceState. runs on load, every 3 min (setInterval), and on visibilitychange when !document.hidden. skips while document.activeElement is an INPUT (don't reload mid-typing).
common.js: every `input[type=text][id]` auto-persists to localStorage key `inputVal:<pathname>:<id>` on input, restores on DOMContentLoaded, then dispatches an `input` event so calculate()/sync logic reruns. no per-page field list needed.

## language
knitting terms English (stitches, rows, round, cast on, knit/purl, cuff, heel, toe); rest of the UI Dutch.
