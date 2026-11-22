# App history and handoff

This file is the working memory of the app. It holds what a person or an AI session needs to keep
improving the app without the chat where it was built. It is shipped with every version
(`HISTORY.md` in the repository root) together with the full source code (`src/`).

Update it when a rule, a file, a formula or the open-work list changes. The version log at the
bottom is written automatically by `tmp/ship.sh`.

- Live app: https://stumbras.github.io/ea-exam-app/
- Kids only: https://stumbras.github.io/ea-exam-app/?kids
- Repository: https://github.com/stumbras/ea-exam-app (branches `main` and `gh-pages`, same content)
- Owner: Solving Life LLC
- Detailed changelog, one long bullet per version with the reason for each change: `README.md`

---

## 1. Continue in a new session (5 steps)

1. Attach the repository `stumbras/ea-exam-app` with push access and clone it to `/home/claude/ea-exam-app`.
2. Run `sh /home/claude/ea-exam-app/src/tmp/restore.sh`. It rebuilds the two working folders and checks
   that a fresh build is byte-identical to the published `index.html`:
   - `/home/claude/ea-app` = sources (from `src/`), with `pwa/` = the published files
   - `/home/claude/ea-exam-app` = the git clone that gets pushed
3. Edit sources in `/home/claude/ea-app`. Never edit `pwa/index.html` by hand; it is build output.
4. Build and check:
   - `cd /home/claude/ea-app && python3 build.py "Version N · Mon D"`
   - syntax: extract every inline `<script>` of `pwa/index.html` to `/tmp/all.js`, then `node --check /tmp/all.js`
   - tests: see section 7
5. Add a bullet for the version at the top of the changelog in `pwa/README.md` (above the previous
   version's bullet), then `sh tmp/ship.sh "Version N" "short message"`. It copies `pwa/` and `src/`
   to the clone, commits and pushes `main` and `gh-pages`.

Tools needed: Python 3, Node, Playwright (`require('playwright')`, Chromium). Voice recording
also needs the Kokoro text-to-speech model; form pictures need `pdftoppm` and the IRS PDFs.

---

## 2. Owner's standing rules

These were given by the owner and stay in force.

- **Super rule (November 23, 2026):** "all this work is foundation for new exam app which i will launch on
  website maybe sell access to it, maybe also android and apple apps so think for best way easiest lowest cost
  but professional sellable product". Every change must fit a product that strangers pay for. See section 12.

- Never publish secret information such as a real SSN or EIN. All numbers in practice data are
  made up (patterns like 400-00-xxxx and 84-xxxxxxx).
- All saved progress must survive every update. Question ids are a hash of the question stem, so
  adding questions is safe and **changing a stem orphans its progress**. Do not reword a stem
  without a reason.
- Research the newest forms and rules first. Do not rely on older versions or guess.
- The main path is guided (one obvious next step) and can be overridden. Pages stay short and
  simple; the owner dislikes long, busy pages. The red main button stays on the first screen.
- Quick drills hold exam-type questions only. Teach only what the exam needs.
- Do not copy questions from other prep products. Write own wording and own names.
- Always write the business name as "Solving Life LLC".
- The owner studies on a phone. Layout is tested at 390 x 844.
- Readiness must be honest: it must count topics not yet touched, and it must never go down after
  a right answer or up after a wrong one.
- Quick 10 should reach all topics fast ("faster, more topic, better").

---

## 3. What the app is

One HTML file, installable and offline (a Progressive Web App). Sections are "parts":

| Part | Section |
|---|---|
| 1, 2, 3 | Enrolled Agent exam (Individuals; Businesses; Representation) |
| 4 | Bookkeeping · QuickBooks · Taxes (Foundation Course, `?course`) |
| 5 | Series 65 |
| 6 | EDPNA |
| 7 | CAA · ITIN (Form W-7) |
| 8 | Colorado notary (the owner said to leave this one aside) |
| kids | Rocket Genius learning games (`?kids`) |

EA Part 1 topics (domains): 1 Preliminary work, 2 Income and assets, 3 Deductions and credits,
4 Taxation, 5 Advising the individual, 6 Specialized returns.

The owner's priority is passing EA Part 1, then Parts 2 and 3.

---

## 4. Source layout and build

`build.py` reads `app.html` (the shell: HTML, CSS, main code) and injects the other files:

- `/*BANK*/` gets every file in the `files` list of `build.py` (about 156 files, order matters:
  a file that wraps a function must come after the file that defines it).
- `/*GENS*/` gets the calculation generators.
- Output: `pwa/index.html`, `pwa/sw.js` (from `sw.src.js`), manifests, `pwa/version.json`,
  plus `ea-exam-drill.html` and `tmp/app.js` (build by-products, not shipped as sources).

Main files:

| File | Holds |
|---|---|
| `app.html` | shell, CSS, state, sessions, audio player, home pages |
| `ea_adapt.js` | EA adaptive engine: readiness, Quick 10, New 10, Audio 10, pace |
| `bank_p1*.js`, `bank_p2*.js`, `bank_p3*.js` | EA facts and questions |
| `bank_p1_exam.js` | Part 1 exam-type questions added from real misses |
| `bank_p1_story.js` | long story questions, AMT and EIC sets, the forced mix, topic spread, outside-practice box |
| `gens*.js`, `gens_exam.js` | calculation generators (`GEX`) |
| `forms.js`, `forms_index.js` | real IRS form viewer and the links to it |
| `bk_*.js`, `sim_*.js` | bookkeeping course |
| `s65_*.js`, `edpna_*.js`, `caa_*.js`, `notary_*.js` | other sections |
| `kids*.js` | Rocket Genius |
| `mk_forms.py`, `mk_forms_lib.py` | build `pwa/forms/` from IRS PDFs |
| `pack_audio.py`, `tools/tts_*.py` | voice recording pipeline |
| `tmp/t*.js` | Playwright tests |
| `tmp/ship.sh`, `tmp/up.sh`, `tmp/restore.sh`, `tmp/sync_src.py` | release, local server, restore, source sync |

Code conventions that matter:

- To extend a function from another file use the wrapper pattern:
  `const f0=f; f=function(){ ...; return f0.apply(this,arguments) }`. Function declarations are
  reassignable. A `const` from the main code is not readable while bank files load, only later at call time.
- No regular-expression lookbehind in literals (old iPhones fail to load the whole app).
- Text shown to the learner is plain English, short sentences.

### Saved state

`localStorage["ea-drill-v1"]` holds `S`:

- `S.it[id] = [box, due, seen, right, lastOk, conf, missCount, ts]` per question or fact
- `S.set.*` settings: `pace` (steady, fast, max), `xp`, `f40`, `ext` (outside practice),
  `rqn` (rotation counter for the forced mix)
- `S.au[id] = [heardCount, day, flag]` audio listening
- `S.hist` session history (mock exams included)

### Question formats

- `Q(part, domain, level, stem, correct, [3 wrong], why)`; id = `"p"+part+"q"+hash(stem)`
- `QX(...)` same, "EXCEPT / NOT" style
- `GEX(id, part, domain, name, make)`: generator; `make()` returns
  `{q, a, w:[up to 2 steps], n, x:[[wrong, why] x3]}`; stem at most 420 characters; id `ge{p}-{id}`
- Fact cards have `t:"f"`; questions `t:"q"`; generators `t:"g"`
- `xaExam(i)`: an exam-type question = four choices and level 2 or higher. Only these go in Quick 10.
- Story questions carry `story:1`; they are long, named-taxpayer questions in the exam's style.

---

## 5. EA engine (`ea_adapt.js`, `bank_p1_story.js`)

### Home screen

Readiness figure, then one row with three buttons (Quick 10, New 10, Audio 10), the pace line,
then the red guided button. All must fit the first phone screen (tests t651, t652, t653, t510).

### Quick 10 (`xaQuick`)

- Pace sets the mix (`XAMIX`): steady 2 new + 3 misses, fast 5 + 2, max 8 + 1; the rest is focus,
  question-type and one calculation.
- `sess.quick.tag[id]` is one of `new`, `miss`, `focus`, `type`, `calc`.
- After a right answer the app moves on by itself: 2 seconds (1 second on Max). A wrong answer
  stops until Next.
- **Forced mix (`storyMix`)**: every Quick 10 gets two places (three on Max) taken in rotation by
  AMT, EIC and story questions in Part 1 (story questions only in Parts 2 and 3); unseen first, then last-missed. It only replaces places tagged
  `new`, never misses, focus or the calculation.
- **Topic spread (Version 183)**: at most two new questions per topic in one drill. Extras are
  swapped for unseen questions from the topics the drill has least of, lowest cover first. Three
  drills reach all six topics (test t733). The header line ends with "N topics".

### Readiness (`xaAll` cached, `xaAll1` computes)

Per topic:

1. Credit per answered question (`xaCredit`): right first try = 1; fixed later and solid = 0.3; else 0.
2. Shrink toward the average of the other topics: `p = (g + 8*0.85*prior) / (wt + 8)`.
   `XATHIN = 0.85` is the caution for thin data; `XACUE = 0.85` is applied as a weight.
3. **Cover (Version 183)**: `cov` = share of the topic's exam-type questions already answered.
   Topic score = `p * (0.75 + 0.25*cov)`. A topic with nothing answered = `p * 0.65`, about 55% of
   the average of the others.

Whole part: topic scores weighted by exam weight. Then:

- **Story weighting (Version 181)**: story questions answered pull 25% of the figure toward the
  story first-try rate.
- **Outside practice (Version 182)**: results typed in on the Diagnosis page (`S.set.ext[part]`,
  last 45 days). With 10 or more questions they carry `min(50%, n/100)` of the figure.
- Mock exams in `S.hist` override the story when they disagree ("trust the mock").

Guard: tests t654 (about 6,000 random answers: a right answer never lowers the figure, a wrong
one never raises it) and t658.

Why this is strict: the owner scored about 1 of 18 on an outside practice set while the app
showed 60%. The app's questions were short; the real exam uses long stories and tests many rules
the app had only as flash cards.

---

### Forms and acronyms drill (`fa_drill.js`, Version 199)

- View `fa`. Items are generated by `faItems(part)`: form cards (title is just "Form N" or "Schedule N"),
  abbreviation cards, and glossary abbreviations (`GL`, `GLP[part]`) that appear in the section's text.
- `faMake` builds a four-choice question in one of two directions; wrong choices come from the same topic first.
- Progress `S.set.fa[key] = [seen, right, lastOk, day]`; gauge `faStat(part)`. Not part of readiness or Quick 10.
- Entry: a third button in the forms row (`fvEntryHtml` wrapper), shown for EA parts and the bookkeeping course.
  Sections without that row (Series 65, EDPNA, CAA) have items but no button yet.
- Test `tmp/t750.js`.

## 6. Audio and forms

### Audio

- Audio 10 on the home row: ten minutes, adaptive order (`xaAudOrder`), keeps going after ten
  minutes unless stopped (a chime and a "+5 min" offer), covers every fact when all is heard.
- Recorded voice (Kokoro) for EA Parts 1, 2 and 3: 1,315 recordings, about 52 MB, in `pwa/audio/`
  with `meta.json`. Other text uses the phone's own voice.
- Pipeline: `tools/tts_gen.py PART WORKER NWORKERS` (run with `python3 -I`), `tools/tts_norm.py`
  (how to say SS-4, CP notices, PTIN and so on; 480-character limit), then `pack_audio.py`
  (packs only fully recorded parts).

### Forms

- `pwa/forms/`: 227 real IRS forms as page pictures plus box positions and the IRS's own field
  text (`<key>.json` = `{t, p:[[w,h]], f:[[page,x,y,w,h,type,label]]}`), built by `mk_forms.py`
  from the 2025 PDFs at irs.gov.
- Every form named in a lesson or explanation becomes a link (`fvLinkify`); not in mock exams or kids.
- Interactive Form 1040 with three worked cases (`F40CASES`) and box-by-box plain explanations.
- Plain explanations per box (`FXR`) exist for 15 forms: 1040, W-2, 1099-NEC, 1099-INT,
  Schedules 1, 2, 3, A, B, C, SE, W-7, 4868, 2848, 8821. The other 212 show the IRS field text only.
- Rules for `FXR` patterns: anchor on the line number (`(?:^|[.:] )N\. `), because labels often
  mention other lines. Check with tests t721, t722, t723.

---

## 7. Tests

Local server: `sh tmp/up.sh` serves `pwa/` at `http://localhost:8765/ea-exam-app/`. It stops after
long pauses; start it again when tests report "connection refused". Test t700 needs
`tmp/old164.html` (restore.sh recreates it from git).

Run a test: `node tmp/tNNN.js`, read lines starting `PASS` or `FAIL`. Each takes 20 to 60 seconds;
run several in the background.

| Test | Guards |
|---|---|
| t651, t652, t653 | home screen fits, Quick 10 content and pace, auto-advance, topic spread |
| t654 | readiness moves the right way on every answer |
| t658 | readiness cautions, topics not started, mock override |
| t700 | upgrade from Version 164 data keeps all progress |
| t701 | walk through the app with real taps |
| t710 | audio |
| t720, t721, t722, t723 | forms viewer and box explanations |
| t730, t731, t732 | specific questions exist; style measurement |
| t733 | story pack, forced mix, outside practice, topic spread |
| t740 | measures rules with no exam-type question (the gap) |
| t510, t610, t612, t620, t641, t642, t645, t650 and `tmp/reg.sh` | older regression set |

When a rule changes on purpose, update the test and say so in the changelog. Do not weaken a
test to make a build pass.

---

## 8. Lessons learned

- A test profile that looks good can still be wrong: check new sessions with real taps (t701).
- Anything added above the red button can push it off the first screen. Add inside existing rows.
- The forced mix once replaced misses and the calculation, and two picks landed on one place. It
  now replaces only places tagged `new` and tracks used places.
- The glossary linker and the form linker fight. The form linker runs first (12 ms observer) and
  converts glossary spans.
- One-tap answers must not be filed as "sure but wrong"; confidence is stored only when right.
- Not yet checked on a real iPhone or in Safari; only Chromium at phone size.
- The right answer is the longest choice more often than chance. New questions should vary this.
- Dates in answers: check the weekday. A due date that falls on a weekend moves to the next business day
  (March 15, 2025 was a Saturday; the 2022 return was due April 18, 2023). Ask for the rule or pick a clean year.

---

## 9. Current state and open work

Last shipped: see the version log below. Version 183 = honest readiness for untouched material,
topic spread in Quick 10, this file and `src/` added to the repository.
Versions 184 to 203 = the gap work: 786 new exam-style questions in twenty files (Part 1 408, Part 2 199, Part 3 179), with `bank_p2_gap4.js`, `bank_p3_gap4.js` (Version 201, 43 Part 3 stories), `bank_p1_gap13.js` (Version 202, 33 worked calculations on deductions and credits) and `bank_p2_gap5.js` (Version 203, 32 Part 2 stories on entities, payroll, fringe benefits, exempt organizations)
(`bank_p1_gap4.js` to `gap12`, `bank_p2_gap1.js`, `gap2`, `gap3` (worked calculations), `bank_p3_gap3.js` (worked stories), `bank_p3_gap1.js`, `gap2`), written from the rule cards, checked one by one against
the cards while writing. Second-reader review so far: `bank_p1_gap4.js` and `gap5.js` (Version 198, 119
questions, no errors), `gap6.js` and `gap7.js` (Version 200, 90 questions, two fixes) and `gap8.js` and `gap9.js`
(Version 201, 76 questions, no errors; one stem has a deposit on Saturday January 3, 2026, left as it is because a
Saturday deposit is possible). `gap10.js` and `gap11.js` were reviewed in Version 202 (60 questions, no errors); `gap12.js` and `bank_p2_gap1.js`
in Version 203 (95 questions, no errors; one question in the new `gap13.js` repeated the facts of a `gap12.js`
question and was given different numbers the same hour). Still to review the same way: `gap13`, `bank_p2_gap2`
to `gap5` and the four Part 3 files. Confirmed for Version 203: late Form 1065 and 1120-S penalty $255 per owner
per month for returns due in 2026 ($245 for returns due in 2025); the 2025 Form 1065 was due March 16, 2026. Confirmed on irs.gov on November 23, 2026 (Version 201 round): 0% capital gain bracket $48,350
single / $96,700 joint / $64,750 head of household, ABLE limit $19,000, 24% gambling withholding on winnings over
$5,000 less the wager, Form 8938 thresholds abroad ($200,000 last day or $300,000 any time; $400,000 or $600,000
joint); from secondary sources citing Rev. Proc. 2024-40: AMT exemption $88,100 and $137,000, QCD $108,000.
Confirmed for Version 202 (irs.gov pages and Rev. Proc. 2024-40 summaries): SALT limit $40,000 less 30% of modified
AGI over $500,000, floor $10,000; senior deduction $6,000 less 6% over $75,000 / $150,000; tips $25,000; car loan
interest $10,000, new vehicles only, phase-out from $100,000 / $200,000; child tax credit $2,200, refundable part
$1,700, $50 per $1,000 over $200,000 / $400,000; QBI thresholds $197,300 to $247,300 and $394,600 to $494,600;
excess business loss $313,000 / $626,000; foreign earned income exclusion $130,000; IRA phase-out $79,000 to
$89,000 single and $126,000 to $146,000 joint; lifetime learning phase-out from $80,000 / $160,000; home
improvement credit 30% with $1,200, $600 windows and $2,000 heat pump limits, ending after 2025.
Owner asked on November 23 "ok so leave it on github?": answered yes, unchanged until shortly before selling.
GitHub Pro (owner, November 23: "should buy it 48 is nothing for me if it is real benefits", and he plans more
apps: mixed poker learning and play, mahjong, tongits, pusoy). Answer given: yes, monthly ($4), for ONE benefit:
Pages from a private repository, so this repository and the future game repositories can be private with a live
test address and no per-app setup by the owner. It does not lift the GitHub Pages rule against running a business,
so serving still moves to Cloudflare before selling (the owner already has a Cloudflare account; his other domain
is registered there). WHEN HE SAYS "Pro is on": (1) stop publishing `src/` and `HISTORY.md` inside the Pages
folder, because a private repository does not hide files that the site itself serves; keep them in the
repository outside the published branch or folder and update tmp/sync_src.py, tmp/ship.sh and tmp/restore.sh;
(2) make the repository private; (3) confirm the app still opens at the same address; if not, switch back at once.
Test note: t700 has a timing check (first draw under 0.8 s at phone speed) that fails when two test batches overlap; never start a second batch while t700 from the first is still running, and run t700 alone if in doubt.
Games apps: the owner confirmed on November 23, 2026: "no real money gambling in any just play for fun learning apps". Play chips and learning only; never add deposits, cash-out or prizes with money value. No written plan for
the games apps was found in this project's chats; ask the owner to paste it if it exists elsewhere. Re-checked against irs.gov on
November 23, 2026, the items the 2025 law changed: adoption credit ($17,280, up to $5,000 refundable, rest carried
5 years), clean vehicle credit (binding contract and a payment by September 30, 2025), residential clean energy
credit (must be installed by December 31, 2025, paying early is not enough), overtime deduction ($12,500 or $25,000
joint, only the FLSA half-time premium, joint return if married), child tax credit SSN rule. All matched.

Next sets, in order (Preliminary work stories were done in Version 194, the owner's missed topics in
Version 195): Part 2 and Part 3 second passes on the rules still
listed by `node tmp/t741.js`; then calculation generators (`GEX`) for estimated tax, capital gain netting and
the QBI limit.

### Open work, in priority order

0. **Queued by the owner on November 23, 2026 (04:36 Manila), to start once the EA work for all parts is done:**
   "i love how all forms and acronyms are integrated in ea app make sure same thing is done for series 65 and
   that edna or what is called soc sec exam". Do for Series 65 (part 5) and EDPNA (part 6) what the EA parts
   have: (a) every form named in a lesson, card or explanation is a link that opens the real form with its
   fields explained (EA uses `forms.js`, `forms_index.js`, `pwa/forms/`, built by `mk_forms.py`); for Series 65
   that means Form ADV Parts 1, 2A, 2B and 3 (Form CRS), ADV-W, Form U4, U5, BD, Form D, Form 13F and similar
   SEC, NASAA and FINRA forms; for EDPNA the SSA forms (SSA-1696, SSA-827, SSA-3368, SSA-3369, SSA-3373,
   SSA-561, HA-501, HA-520, SSA-1699, SSA-632, SSA-634, fee forms and others the bank names); get the newest
   versions from sec.gov, finra.org, nasaa.org and ssa.gov first; (b) every acronym is in the glossary and is
   linked where it appears (`gloss.js`, the `span.gl` linker); (c) a card and an exam-type question for each
   form and each acronym, as `bank_p1_gap8.js` did for EA. Start by listing which forms and acronyms the
   part 5 and part 6 banks already mention and which of them the glossary and the form viewer lack.

1. **Close the question gap (the owner asked to do this non-stop).** Measured by `tmp/t740.js`:
   rules that exist only as flash cards, with no exam-type question.
   - Part 1 at the start: 409 of 757 (Income and assets 160 of 272, Deductions and credits 90 of 195,
     Specialized returns 68 of 118, Preliminary work 44 of 87, Taxation 28 of 56, Advising 19 of 29)
   - Part 1 after Version 184 (`bank_p1_gap4.js`, 76 questions): 327; Income and assets 87
   - Part 1 after Version 185 (`bank_p1_gap5.js`, 43 questions): 293; Deductions and credits 54
   - Part 1 after Version 186 (`bank_p1_gap6.js`, 45 questions on topics 1, 4 and 5): 266
   - Part 1 after Version 188 (`bank_p1_gap8.js`, 48 questions on forms and terms): 234, with 824 exam-type
     questions (643 before the gap work) and 254 story questions. The measure cannot go much lower: it needs two
     matching words from the card's title, so one-word terms (QCD, Boot) and look-alike form names never count.
   - Part 1 after Version 187 (`bank_p1_gap7.js`, 45 questions on Specialized returns): 242. What is left in
     Part 1 is mostly form names and definitions. The measure credits at most two rules per question.
   - `node tmp/t741.js` writes the rules still untested to `/tmp/un_p1.json` (and p2, p3)
   - Part 2: 131 of 281 at the start; 84 after Version 189 (`bank_p2_gap1.js`, 65 questions); 81 after
     Version 191 (`bank_p2_gap2.js`, 38 on forms and terms).
   - Part 3: 139 of 277 at the start; 100 after Version 190 (`bank_p3_gap1.js`, 71 questions); 98 after Version 192
     (`bank_p3_gap2.js`, 31 on terms and forms).
   - Gap questions in Parts 2 and 3 carry the flag `gp`; test `tmp/t734.js` checks them.
   - Method: about 30 to 40 questions per session, own wording, long story style for at least a
     third, start with Income and assets. Add them to `bank_p1_gap4.js` (or a new file listed in `build.py`). The measure matches words, so
     restate the rule in the explanation using the rule card's own words. Run t740 again and report the new numbers.
2. Part 2 has 68 story questions (Versions 189 and 191), so its readiness and Quick 10 use them.
   Part 3 has 45 story questions since Version 190.
3. Keep the right answer from being the longest choice: after drafting a set, list the questions where it is
   strictly longest and reword until under 30% (t733 and t734 fail above that).
4. Outside misses still to explain and cover (ids from the owner's outside practice, no
   screenshot yet): #100709 Retirement Income, #100598 Gift Tax, #100172 Property.
5. Plain box-by-box explanations for more forms: 1041, 1065, 1120-S, 706, 709, 8867 first.
6. Test on a real iPhone (Safari): audio chime, keep-going audio, form viewer.
7. Check whether the military state-residence rule is on the current IRS exam outline.

### Topics the owner has missed on outside practice (keep covering)

AMT, earned income credit rules and the ban periods, investment interest on Schedule A, capital
gain distributions without Schedule D, gifted property basis, excess IRA contributions,
nonbusiness bad debt, mileage, Form 8332, gift tax returns, stock dividends, nonresident aliens,
disaster losses.

---

## 10. Tax figures the bank uses (tax year 2025)

Check against irs.gov before changing or adding; the exam window sets which year applies.

- Standard deduction 15,750 / 31,500 / 23,625
- Child tax credit 2,200 (refundable part 1,700); other dependents 500
- SALT cap 40,000
- Schedule 1-A: tips up to 25,000, overtime, car loan interest, senior 6,000 each
- AMT exemption 88,100 single, 137,000 joint, 68,500 separate; 28% above 239,100; phase-out from
  626,350 / 1,252,700
- EIC investment income limit 11,950
- Gift exclusion 19,000
- Social security wage base 176,100
- IRA 7,000 (8,000 at 50); HSA 4,300 / 8,550
- Mileage 70 cents; QCD 108,000
- Tax table method: tax on the midpoint of the 50-dollar row

---

## 12. Product plan (from the super rule)

Owner's own view of the market (November 23, 2026): "be realistic such app will not be superseller but of
course we can add more exams to make sales bigger". So: keep fixed costs at or near zero, build nothing that
needs upkeep or a monthly bill until sales justify it, and treat each added exam (Series 65, EDPNA, later
others) as a new edition from the same code. Prefer the simplest way to take money over the most complete one.

The owner means to sell this as an exam-prep product: a website with paid access, perhaps Android and Apple apps.
Recommended path, cheapest first. Nothing here is built yet unless marked done.

1. **One codebase.** The app is already an installable, offline web app (PWA). Keep it that way: the same build
   serves the website, an Android wrapper and an iPhone wrapper.
2. **Editions by build flag (to build).** `build.py` should take an edition name and include only that edition's
   files and parts: "EA" (parts 1 to 3, forms, audio), later "Series 65" and "EDPNA". The kids app, the bookkeeping
   course written for one learner, and anything personal stay out of sold editions.
3. **Content rules for a sold product.** All questions in own wording (already a rule). IRS forms are public
   domain. The recorded voice is Kokoro-82M (Apache-2.0). Keep a list of every outside asset and its license in
   README Credits. No real names, addresses or ID numbers anywhere. State clearly: study aid, not tax advice, not
   affiliated with the IRS, SSA, NASAA or FINRA. Before selling, every question set needs a second review, and
   ideally a check by a credentialed enrolled agent.
4. **Hosting decision (owner, November 23, 2026: "want also same easy access for claude like it is on github, do
   paid github instead").** Stay on GitHub so the working method does not change. Steps, in this order:
   (a) the owner upgrades the account to GitHub Pro (checked on docs.github.com: the free plan allows GitHub Pages
   only in public repositories, GitHub Pro allows it in private ones; the published site itself stays public);
   (b) only after that, make the repository private (Settings, General, Danger Zone, Change visibility), and
   check the app still opens; (c) later, the app's own address: a CNAME record `study` pointing to
   `stumbras.github.io` in the Wix domain settings, and the custom domain set in the repository's Pages settings.
   Step (c) changes the app's address, and saved progress is stored per address: before it, every device must
   export its progress (Settings and history) and import it at the new address, or a transfer step must be built
   and shipped first. Step (c) also makes the Android wrapper possible (assetlinks.json at the domain root; the
   repository already has `.nojekyll`, which lets a `.well-known` folder be served).
   CORRECTION the same day, after the owner asked "so is github pro best for this?": checked
   docs.github.com "GitHub Pages limits": Pages "is not intended for or allowed to be used as a free web-hosting
   service to run your online business, e-commerce site, or any other website that is primarily directed at either
   facilitating commercial transactions or providing commercial software as a service", with a soft limit of
   100 GB a month and 1 GB per site. So GitHub Pro is fine for hiding the source while the app is the owner's own
   study tool, but the SOLD product should not be served by GitHub Pages. Better plan, same working method: the
   repository stays on GitHub (private repositories are free, no Pro needed) and Cloudflare Pages (free plan:
   deploys from a private GitHub repository on every push, custom domains, 25 MiB per file, 20,000 files) serves
   it at study.solvinglifellc.com. Claude keeps pushing to GitHub exactly as now. Waiting for the owner's choice.
   Background: Today the app and, since Version 183, its full source sit in a PUBLIC GitHub repository served by
   GitHub Pages. That is fine for personal study and wrong for a product: anyone can copy it. Before launch: make
   the repository private and serve the site from a host that builds from a private repository (Cloudflare Pages
   has a free tier) on a subdomain of the business domain. Changing visibility takes the current GitHub Pages
   address down on a free GitHub plan, so do both steps together. This is the owner's decision; not done.
5. **Use the owner's Wix site (said November 23, 2026: "I have already my llc website solvinglifellc.com so
   exams preparation course/app could be part of it on my wix site").** Recommended split:
   - Wix is the shop and the member login: a sales page, Wix Pricing Plans for payment (one-time or
     subscription), and a members-only "Open the app" page limited to people with a paid plan. Checked on
     support.wix.com on November 23, 2026: Pricing Plans can restrict pages to plan holders, and a subdomain can be
     pointed at an external host with a CNAME record in the Wix domain settings (only when the domain uses Wix
     name servers, not "pointing").
   - The app itself stays one file with its audio and form pictures on its own address, for example
     study.solvinglifellc.com, hosted outside Wix. It must have its own address to install and to work offline;
     inside a frame on a Wix page those two things do not work.
   - The link between them, version 1: the members-only Wix page shows the app link and the member's access key;
     the app asks for the key once. Version 2: a small Wix backend function (Velo `wix-http-functions`) answers
     "does this member hold a paid plan" so the app can check and turn access off when a plan ends. Not built.
   - **Owner's rule (November 23, 2026): "i already have prepaid that wix plan so use it as much as posible
     too".** So Wix carries everything except the app's own files: sales page, checkout (Pricing Plans),
     member accounts and login, emails to buyers, blog/search pages for each exam. No second paid service.
   - CORRECTION, checked on dev.wix.com the same day (pages updated October–November 2026). Wix now has "Wix
     Headless" with two paths:
     (a) Self-managed, "add a frontend to an existing Wix site": the editor-built site stays the public website
     and another frontend, hosted elsewhere, connects through the Wix JavaScript SDK (`@wix/sdk` with
     `OAuthStrategy`, `@wix/pricing-plans`, `@wix/members`, `@wix/redirects`). Member login uses the Wix login
     page (redirect and token exchange; the Wix site must be published). This is the path that uses the
     prepaid plan: the app sends the buyer to the Wix login, then asks Wix for that member's plan orders and
     unlocks when one is active. It replaces "version 1 access key" and "version 2 Velo function" above.
     To confirm when building: the exact call for a member's own orders, and that the result is cached so the
     app still opens offline (re-check when online, for example every 7 days).
     (b) Wix-managed headless: Wix itself hosts a static build ("vanilla HTML and JavaScript"), by upload or by
     the Wix CLI (`preview` and `release`), with CDN and SSL. So the older line "Wix cannot host a standalone
     HTML app" is no longer true. BUT it is created as a NEW project in the Wix dashboard, separate from the
     existing site; the docs say a premium plan unlocks custom domains and payments, so it would most likely
     need a second plan, and the other Wix-hosted choice REPLACES the editor-built site. Not confirmed: file
     count/size limits for about 3,000 files and 100 MB, and service worker behaviour. Use (b) only if the owner
     wants one bill and accepts a second plan; otherwise (a) with free hosting.
   If Wix payments or plans turn out too limited, the fallback is a merchant of record:
   Use a merchant of record (for example Lemon Squeezy or Paddle) so sales
   tax and VAT are handled for the business; it issues a license key, the app asks for the key once and checks it
   with the provider's license API. A free part (for example the diagnostic and one topic) sells the rest. A
   web app that holds all content in one file can be copied by a determined buyer; if that matters later, serve
   paid content from a small backend after sign-in (Cloudflare Workers has a free tier).
   - **The owner's Wix plan (checked November 23, 2026):** Wix Core, prepaid for 2 to 3 years (the owner said 3 years earlier in November and "like 2 years" on November 23; the exact end date is on the Wix billing page), bought about November 11,
     2026, in the Wix account under the business mailbox (site shown as "my-site-3" in Wix emails). Core is the
     lowest plan that accepts online payments, so Pricing Plans (one-time or recurring) and members-only pages
     work without an upgrade. A session has no Wix login: the `wix:*` skills need a Wix API key or OAuth, and
     billing receipts go to the business mailbox. The free business apps that came with the plan must be claimed
     within 60 days of purchase (about January 10, 2027) and are free for one year only.
   - **Wix mobile apps (owner sent a screenshot of the Wix Owner app, November 23, 2026).** "Spaces by Wix" is
     Wix's free members app; the business appears inside it; members can buy and manage plans, get push
     notifications and chat; tabs can be limited to holders of a pricing plan. Use it as the free buyers' side:
     a plan-locked tab with the button that opens the study app. NOT confirmed: whether a Spaces tab can open
     an outside web address directly (check when building). "Get your own mobile app" (Branded App) is a
     separate paid plan from about $99 a month plus the Apple and Google fees, is removed from the stores when
     cancelled, and is built from Wix blocks, so it would not contain the study app. Do not buy; the Android
     route in item 6 costs $25 once.
6. **Android app: the owner wants it (November 23, 2026: "why not do android app also based on this it is
   easier to sell? not that hard to add"). Agreed; it is the easiest way to take money, because Google Play
   collects payment and handles tax.** Checked the same day on Google's and Chrome's developer pages:
   - The app is wrapped as a Trusted Web Activity with Bubblewrap or PWABuilder; no rewrite. The web app must be
     installable and must pass Digital Asset Links, a file at `/.well-known/assetlinks.json` on the ROOT of the
     app's own domain. The present address (stumbras.github.io/ea-exam-app/) cannot serve that file, so the app
     needs its own address first (study.solvinglifellc.com or similar). Hosting inside Wix is not possible: Wix
     does not host a standalone HTML app with its own service worker, only frames and code snippets.
   - Google Play developer account: US$25 once. Open it as an ORGANIZATION account for Solving Life LLC (needs a
     free D-U-N-S number); personal accounts opened after November 13, 2023 must first run a closed test with
     12 testers for 14 days, organization accounts need not.
   - Selling inside a Play app must use Google Play Billing. A Trusted Web Activity can do this from the web
     code with the Digital Goods API and the Payment Request API (Bubblewrap `playBilling` feature). Two simple
     models: a paid app (one price, no code needed), or a free app with a free part and one in-app purchase that
     unlocks the rest (needs the edition flag and a small unlock check).
   - To prepare on the app side (not done): edition build "EA" without personal sections; manifest with id,
     description, screenshots, categories; make sure a cold start works offline and unknown addresses fall back
     to the app; privacy policy page; store listing text and screenshots.
   Other stores: Android alternatives aside, Google Play
   charges a one-time developer fee. Apple: a thin native wrapper (Capacitor) and a yearly developer fee; Apple
   and Google both have rules about selling digital content inside apps and take a commission, so read the
   current rules before choosing in-app purchase or a website-only sale. "Add to Home Screen" already gives an
   app-like install on both without any store.
7. **Before launch checklist.** Product name and logo that are not personal; terms, privacy policy and refund
   policy; an accounts-free default with progress on the device (already so) and optional sync later; real
   iPhone and Android testing; analytics that respect privacy; a way to push corrections fast (the update button
   exists).

## 11. Version log

One line per shipped version, newest first. Written by `tmp/ship.sh` from the git history.

<!-- VERSION-LOG -->

- 2026-11-22 Version 203: Version 203: review of Part 1 set 12 and Part 2 set 1 (no errors), 32 Part 2 stories (bank_p2_gap5.js), one repeated IRA question renumbered
- 2026-11-22 Version 202: Version 202: review of Part 1 sets 10 and 11 (no errors), 33 Part 1 calculation stories (bank_p1_gap13.js)
- 2026-11-22 Version 201: Version 201: review of Part 1 sets 8 and 9 (no errors), 43 Part 3 stories (bank_p3_gap4.js), Wix plan notes in HISTORY
- 2026-11-22 Version 200: EA: second-reader review of sets 6 and 7 (two fixes); 31 Part 2 worked story questions
- 2026-11-22 Version 199: Forms and acronyms drill with a gauge (all EA parts); product plan recorded in HISTORY.md
- 2026-11-22 Version 198: EA: second-reader review of sets 4 and 5 (no errors); 30 retirement income story questions
- 2026-11-22 Version 197: EA Part 3: 34 story questions on penalties, Circular 230 duties, interviews, courts, collection and e-file rules
- 2026-11-22 Version 196: EA Part 2: 33 worked story questions on the core calculations (basis, distributions, recapture, exchanges, deposits, plans)
- 2026-11-22 Version 195: EA Part 1: 30 story questions on the topics missed in outside practice (EIC, AMT, gifts, stock dividends, disaster losses, basis)
- 2026-11-22 Version 194: EA Part 1: 30 story questions on Preliminary work (dependents, filing status, residency, who must file)
- 2026-11-22 Version 193 notes: history: irs.gov re-check of the 2025 law items, next sets listed
- 2026-11-22 Version 193: EA Part 1: 28 story questions on Taxation and Advising
- 2026-11-22 Version 192: EA Part 3: 31 more exam-style questions on terms and forms; two date fixes
- 2026-11-22 Version 191: EA Part 2: 38 more exam-style questions on forms and terms; Quick 10 in Parts 2 and 3 forces story questions, not AMT or EIC
- 2026-11-22 Version 190: EA Part 3: 71 exam-style questions on rules that had none; Part 3 now has story questions
- 2026-11-22 Version 189: EA Part 2: 65 exam-style questions on rules that had none; Part 2 now has story questions
- 2026-11-22 Version 188: EA Part 1: 48 exam-style questions on the forms and terms of Income and Deductions (gap set 5)
- 2026-11-22 Version 187: EA Part 1: 45 exam-style questions on Specialized returns rules that had none (gap set 4)
- 2026-11-22 Version 186: EA Part 1: 45 exam-style questions on Preliminary work, Taxation and Advising rules that had none (gap set 3)
- 2026-11-22 Version 185: EA Part 1: 43 exam-style questions on Deductions and credits rules that had none (gap set 2)
- 2026-11-22 Version 184: EA Part 1: 76 exam-style questions on Income and assets rules that had none (gap set 1)
- 2026-11-22 Version 183: EA: readiness counts untouched material; Quick 10 spreads over topics; HISTORY.md and src/ ship with the app
- 2026-11-22 Version 182: EA: outside practice calibrates readiness; 12 more story questions on rules that had no exam question; coverage gap measured
- 2026-11-22 Version 181: EA Part 1: readiness leans on long story questions; EIC set; 37 story questions; AMT, EIC and stories rotate into Quick 10
- 2026-11-22 Version 180: EA Part 1: 23 story-style questions, AMT set, both pushed into Quick 10; excess IRA, bad debt, gift return and stock dividend questions
- 2026-11-22 Version 179: EA Part 1: four questions added (AMT add-backs, capital gain distributions without Schedule D, military state residence)
- 2026-11-22 Version 178: EA Part 1: new exam calculation, interest deductible on Schedule A (investment interest limit, second home, personal interest)
- 2026-11-22 Version 177: Audio: Part 3 recorded voice (all EA parts recorded); Forms 2848 and 8821 explained box by box
- 2026-11-22 Version 176: Forms: every box explained on Form W-7 and Form 4868
- 2026-11-22 Version 175: Audio: Part 2 recorded voice (281 facts), plays with the phone locked
- 2026-11-22 Version 174: Forms: every box explained on Schedules 2, 3, A, B and SE
- 2026-11-22 Version 173: Forms: written box-by-box explanations for W-2, Schedule 1, Schedule C, 1099-NEC and 1099-INT
- 2026-11-22 Version 172: Real IRS forms: 227 forms with every box tappable, form names are links, Form 1040 explained box by box with fill-in practice
- 2026-11-22 Version 171: EA: Audio 10 on top (keep-going, covers every fact), 2 s before auto-advance, glitch fixes after the fast-pace updates
- 2026-11-21 Version 170: EA readiness: count every question, with cautions for length-cued answers and thin data; shows what the figure rests on and compares with mocks
- 2026-11-21 Version 169: EA: readiness by first tries (never rises on a miss), 48 exam-style calculations, Explain it how-to, 67 fuller explanations, 58 length giveaways removed
- 2026-11-21 Version 168: EA Parts 1-3: pace control, one-tap answers, New 10, Quick 10 exam questions only
- 2026-11-21 Version 167: EA Parts 1-3: readiness on top, Quick 10 adaptive drill, predicted score, ask-first learning, Diagnosis page, look-alike questions
- 2026-11-21 Version 166: EA Parts 1-3: adaptive diagnostic, lesson checks, lesson-by-lesson path, question-only accuracy, smart drill fix
- 2026-11-21 Version 165: CAA refresher and client checklist; lessons for EA Parts 2 and 3
- 2026-11-21 Version 164: review release - study path for every exam section, automatic safety copies of progress, balanced mock exams, section terms, fixes
- 2026-11-20 Version 163: QuickBooks, Tax Return and Business Tax Bootcamps; simpler step lists; one-tap reason check after a wrong answer
- 2026-11-20 Version 162: mistake notebook, terms page with my looked-up list, Bootcamp certificate
- 2026-11-20 Version 161: kids: fix warm-up / Mission Path deadlock, fix Lv undefined in warm-up header
- 2026-11-20 Version 160: Bookkeeping Bootcamp - module 2 rebuilt as 13 learn-then-do steps with a month-end close capstone
- 2026-11-20 Version 159: tap-to-explain glossary in every study section, pinned Back button on inner screens
- 2026-11-20 Version 158: Smart review fix - missed-then-right questions no longer due forever, 10-minute rest before a repeat
- 2026-11-20 Version 157: tidy pass - shorter start pages, Go button first, folded reference sections, notary path one step at a time, clipped badge and sideways scroll fixes
- 2026-11-20 Version 156: Chess coach, hoverslam landing computer, Brick Bay traffic lights, EA Part 2 and 3 exam-style packs
- 2026-11-20 Version 155: Sky Pilot 3 (real climb and turn physics, airport, town, PAPI, sunset), Tesla Drive 3 (grip, traffic signals, trip computer), retina-sharp game canvases
- 2026-11-20 Version 154: Guided next-step button, EA exam-style pack, notary path with links, Kids Career Labs, Genius Hospital, Desktop Lab, progress safety
- 2026-11-19 Version 153: Kids: realistic Sky Pilot with honest landings, weather, emergencies, ATC radio, crash physics
- 2026-11-19 Version 152: Kids: Brick Bay buildings for every game, vault and city hacking, police escape by plane, quick decision stats
- 2026-11-19 Version 151: Kids: hubs home, Daily Genius one button with performance, Robot Chess 12 levels, game time limits
- 2026-11-19 Version 150: Kids: Tesla World banner near the top, all Tesla games inside the hub
- 2026-11-19 Version 149: Kids: one Genius Quiz with achievement badges instead of 13 topic tiles
- 2026-11-19 Version 148: Kids: Tesla World hub, Vegas Loop map, Mechazilla Catch game, 21 quiz questions
- 2026-11-19 Version 147: Kids: Free Pass and grown-up 30-minute unlock, guided mode stays strict
- 2026-11-19 Version 146: Foundation Course app: welcome screen, skills map, Journal Entry Lab, Run Solving Life LLC, daily workout
- 2026-11-19 Version 145: Calculations as 4-choice questions with worked examples, step hints and teach-me retries
- 2026-11-19 Version 144: Smart drill v2: no repeats, harder faster, more calculations, 53 hard P2/P3 questions
- 2026-11-19 Version 143: EA: smart spaced-repetition drills + 20 drill sets from the 2026 course slides
- 2026-11-19 Version 142: Rocket Genius: Manila mahjong, guided must-do chain, all activities connected
- 2026-11-19 Version 141: Rocket Genius: Poker Academy (No-Limit Hold'em from zero), Today's Mission Path
- 2026-11-19 Version 140: Rocket Genius: real aircraft per mission, cockpit six-pack, checklists, Pilot School hub; fix quiz generator name clash
- 2026-11-19 Version 139: Rocket Genius: GPS grid, map, Navigator mission, pilot instruments
- 2026-11-19 Version 138: Rocket Genius: skipped activities flash red with bonus tickets, faster chess difficulty
- 2026-11-19 Version 137: Rocket Genius: helicopter, drone, missiles, history, stricter rotation
- 2026-11-19 Version 136: Rocket Genius: Air Force/Space Force/Cyber skills, formation, sound barrier, search & rescue, booster return
- 2026-11-19 Version 135: Rocket Genius: Genius Path (6 hero skills, daily curiosity/creativity/teaser, new lessons, Invention Workshop)
- 2026-11-19 Version 134: Rocket Genius: fix sound/update buttons covering the back button
- 2026-11-19 README: tidy rotation and lessons entries
- 2026-11-19 Version 133: Rocket Genius: Brick Bay jets, Sky Pilot fighter jet, Law track, rotation tied to every game
- 2026-11-19 Version 132: Rocket Genius: Sky Pilot flight simulator
- 2026-11-19 Version 131: Rocket Genius: Termux missions, Brick Bay on-foot/buildings/combos
- 2026-11-19 Version 129: EA: 9 new quick-decision drills; Kids renamed Rocket Genius: smart rotation, Genius Lessons, Music Lab with mic, Phone Powers, Spelling Bee on home, tilt fix
- 2026-11-19 Version 128: Kids link suggests the name Space Academy when added to an iPhone home screen
- 2026-11-19 Version 128: Cyber Tank: treads + turret in Road Trip (crush + fire), Derby (cannon), Brick Bay
- 2026-11-18 Version 127: Space Mission: rocket builder (TWR, kN, tonnes) + launch, Mach 1, Max-Q, staging, Karman line, orbit, docking, re-entry, landing; multi-touch hold fix
- 2026-11-18 Version 126: Booster Landing 2.0: 10 levels (night, Moon, Mars, flip, asteroids, Falcon Heavy), legs, stars, Mission Control fuel question
- 2026-11-18 Version 125: README for Brick Bay and derby shooting
- 2026-11-18 Version 125: Brick Bay toy-brick city game, derby shooting + fixed joystick, coach off by default
- 2026-11-18 Version 124: Derby: tap-to-drive plus thumbstick, car keeps rolling, coach waits for first touch
- 2026-11-18 Version 123: Faster adaptive climb: double level-ups on perfect streaks, chess to level 25 with expert first-try mode
- 2026-11-18 Version 122: Derby rules screen, Rules button, step-by-step coach with on/off switch
- 2026-11-18 Version 121: Derby rebuilt as Smash Arena: thumbstick, boost button, follow camera, mini-map, respawns, score goal, spins, flying parts, bombs
- 2026-11-18 Version 120: Tesla Hacker pack (20 Linux missions + ELITE), Byte helper with map, typo fixes, auto-type, ACCESS GRANTED rewards for Tesla Drive, README
- 2026-11-18 Version 119: Tesla Drive 2.5: real Tesla designs, Model X, Demolition Derby, hints, ramps, Boring tunnel, Easter eggs
- 2026-11-18 Version 118: Kids: Tesla Drive Brain Gates, Autopilot view with detection boxes, turn-signal and chime sounds, bolt combos, sparks, smoke and rain; tycoon sounds (dice, cash register, building, asteroid booms, dome alarm, Mars wind)
- 2026-11-18 Version 117: Kids: Mars Colony Tycoon (build, idle income, Mars science facts), Mission Control learning credits, Asteroid Defense math-facts arcade, Mars Empire board game; README updated
- 2026-11-18 Version 116: Kids: natural voice for poker lessons and the new SpaceX and poker lines
- 2026-11-18 Version 115: Kids: all natural-voice recordings (spelling bee words, letters, lessons)
- 2026-11-18 Version 114: Kids: Poker School in a new Strategy Club, SpaceX quiz and Booster Landing game, natural recorded voices (Kokoro), answer by voice, themes, faster terminal with word chips and launch commands, real progress files in the terminal; README updated
- 2026-11-18 Version 113: Kids: Computer Academy (Linux, Windows PowerShell and Mac terminals plus Windows, Mac and Linux Mint shortcut missions), Tesla Drive 2.0 (5 models, paint, Autopilot, Plaid, Superchargers, regen braking, day and night, landscapes, missions, tilt steering, vibration), top-bar update button, automatic progress backup
- 2026-11-18 Version 112: Kids: Tesla Drive reward rides with tickets, flying Rocket Roadster with space phase, rocket launch cutscene, Rocket Roadster cartoon video, expert Tesla and EV questions
- 2026-11-18 Version 111: Kids: guarantee 4 different answer choices on every picture question
- 2026-11-18 Version 110: Kids: game-show Quiz Show with maps, flags, planets, Tesla and spelling bee, Hacker Terminal (Linux), Brain Scan gauge, power-up lessons, review of mistakes, no-points hints, trophies and certificates, voices, sounds, music, update button
- 2026-11-18 Version 109: Kids: Block Miner and Chess Quest games, daily chest and quests, base building, prize goals, profile with birthday, kids-only link, grown-up progress corner
- 2026-11-18 Version 108: Kids Space Academy: red Kids button on the start page, 3 games across math, English, science, code and geography with adaptive levels, ranks, badges and a grown-up corner
- 2026-11-18 Version 107: Cleaner study page: progress card, Quick drill (5, 10 or 20, adaptive: smart, redo misses, common mistakes, weakest area, new material), Quick decisions with progress bars (new drills: basis, taxable or not, capital or ordinary, dependents, due dates, which IRS form), practice cases with progress; all other modes, progress details and settings folded
- 2026-11-18 Version 106: Part 3: 2026 SEE user fee cut from $99 to $66 per part (T.D. 10045)
- 2026-11-18 Version 105: EA Part 1: education credit case (AOTC expenses, amount and refundable part). CO Notary: commission problems case (stolen journal, name change, resignation, stamp and journal)
- 2026-11-18 Version 104: EA Part 2: 3 more business cases (S corporation basis and excess distribution, partner K-1 with guaranteed payment and basis-limited loss, an estate's first Form 1041)
- 2026-11-18 Version 103: EA Part 1: Prepare a return step by step, 4 practice cases for 2025 (head of household and child credits, tips and overtime on Schedule 1-A, senior deduction with the per-spouse phase-out, home sale exclusion)
- 2026-11-18 Version 102: EA Part 3: Represent a client step by step (5 cases: audit and Forms 2848, 30-day letter, 90-day letter and Tax Court, CDP and payment plans, trust fund penalty). EA Part 2: Advise a business step by step (3 cases: entity and S election, 2025 bonus and §179, payroll setup)
- 2026-11-18 Version 101: Series 65: Advise a client step by step, 5 practice cases (new client onboarding, custody exceptions, state or SEC registration, wash sale basis, agency cross, loans and testimonials)
- 2026-11-18 Version 100: EDPNA: Work a claim step by step, 5 practice cases with 2026 amounts (appointment and appeal deadline, SGA with IRWE, hearing and Appeals Council, fee cap and direct-payment assessment, SSI payment and resources)
- 2026-11-18 Version 99: CAA · ITIN: 3 more Fill a Form W-7 cases (Exception 3 mortgage, U.S. military dependent with notarized copies, Canadian retiree with Exception 1(d) treaty pension). FTA card notes the 2027 switch to automatic relief
- 2026-11-18 Version 98: IRS paper refund check phase-out (Executive Order 14247, FS-2026-02): CP53E, online account, 6-week paper check fallback; Part 3 answer lengths rebalanced
- 2026-11-18 Version 97: Calculation trainer: 8 new Part 2 problems (§1245 and unrecaptured §1250 gain, 40% bonus plus MACRS, employer FICA, excess business loss, DNI, built-in gains tax, partner SE income) and 4 new Part 3 problems (failure to file and pay, minimum late-filing penalty, trust fund recovery penalty, information return penalties)
- 2026-11-18 Version 96: Slide lessons for EA Part 2 (7 units: entities, partnerships, S and C corporations, 2025 depreciation, payroll and information returns, trusts, exempt organizations and plans) and Part 3 (7 units: practice rights, Circular 230 duties, sanctions and penalties, Forms 2848 and 8821, exams and appeals, collection, e-file and refunds)
- 2026-11-18 Version 95: Slide lessons for CAA · ITIN (5 units) and Colorado Notary (5 units) with form examples, document tables and flows
- 2026-11-18 Version 94: Colorado Notary: Notarize step by step, 6 practice cases (deed acknowledgment, jurat with affirmation, representative capacity, copy certification, interpreter and signature by direction, remote notarization). Practice answers rebalanced so length gives nothing away
- 2026-11-18 Version 93: CAA: Form W-7 line-by-line cards and 9 questions (lines 1a, 1b, 2, 6a, 6b, 6g, signing by mark, treaty country, office code). Notary: 10 identity, interpreter and refusal questions from C.R.S. 24-21-507 to 510
- 2026-11-18 Version 92: Series 65: outline gaps (geopolitical risk, manager tenure and style drift, annualized and real returns, HFT, marking the close, sharing in accounts) and NASAA's May 4, 2026 recordkeeping amendments; IAR CE deficiency rule
- 2026-11-18 Version 91: Bookkeeping: 35 medium and hard questions (payroll limits, safe harbor, adjusting entries, bank reconciliation, COGS, QuickBooks deposits, bills, closing date, 1099 card payments, 2025 OBBBA deductions and credits)
- 2026-11-18 Version 90: EA Part 2 and Part 3 reach 400 questions for 4 full mocks: OPR proceedings, 2025 information return and late-filing penalties, ex parte, Form 8938 statute, IRA levy, §704(c), disguised sales, ESBT, farm FICA
- 2026-11-18 Version 89: EA Part 2 (26 questions, 12 cards) and Part 3 (37 questions, 16 cards): OBBBA QSBS, BOI after March 2025, related parties, §1446, PTET, §45S, refund lookback, IDR, SFR, passports, collection standards, payment plan fees, PATH hold, AEP 2026 update
- 2026-11-18 Version 88: CAA · ITIN: Fill a Form W-7 practice (8 cases), Form W-7-COA (Rev. 8-2025), Exception 1(a) partnership papers from June 1, 2026, Pub 1915 (Rev. 12-2025) records checklists
- 2026-11-18 Version 87: Colorado Notary: official SOS rules (8 CCR 1505-11), petition circulator affidavits (C.R.S. 1-40-111) and real property acknowledgments (Title 38)
- 2026-11-18 Version 86: new Colorado Notary course (C.R.S. 24-21-501, SOS handbook, Oct 2026 checklist, fee schedule): 54 flashcards, 65 questions, 40-question mocks; 18 new EA Part 2 questions
- 2026-11-18 Version 85: EA Part 1: 31 new 2025-law questions (SSN rule for the child tax credit, senior/tips/car-loan phase-outs, SALT phase-down, credits that ended, Roth conversions, 529-to-Roth, QCD, HSA)
- 2026-11-18 Version 84: EDPNA: medical expert handbook (June 2024), SSI vs SSDI work incentives 2026, CDR and age-18 rules, HALLEX renumbering
- 2026-11-18 Version 83: OLT office practice follows the Nov 18 Remote Client Process: portal invite after Personal Info, 30-minute link, DM Docs, invoice rule, bank consents, four 8879 signing ways, quick fixes
- 2026-11-18 Version 82: EDPNA 2026 updates from SSA Pub 17-008 (SSI 2026) and Pub 05-10029 (Disability Benefits, July 2026) and the 2024 conduct rules
- 2026-11-18 Version 81: new CAA · ITIN section from IRS Pub 4520, Pub 5726 and Form W-7 instructions: 57 flashcards, 57 questions, mocks
- 2026-11-18 Version 80: 73 new EA Part 2 and Part 3 questions; rewrote 68 thin imported Series 65 and EDPNA questions
- 2026-11-18 Version 79: balanced Bookkeeping answer choices, bias guard, exam-accurate pace hint
- 2026-11-18 Version 78: balanced answer choices in EA Part 1 and Part 2
- 2026-11-18 Version 77: advice from people who passed, mocks draw unseen questions first
- 2026-11-18 Version 76: EA Part 3 answer choices rebalanced
- 2026-11-18 Version 75: Series 65 answer choices rebalanced
- 2026-11-18 Version 74: EDPNA answer choices rebalanced (right answer no longer the longest give-away)
- 2026-11-18 Version 73: practice tax software uses tax year 2026 amounts
- 2026-11-18 Version 72: Certificate of Accuracy is Form W-7 (COA)
- 2026-11-18 Version 71: retiree (Social Security, RMD, QCD, senior deduction) and amended return (1040-X) cases
- 2026-11-18 Version 70: input-box look in field maps, drills linked from the EA home
- 2026-11-18 Version 69: decision drills (filing status, above or below the line, standard or itemized, which return)
- 2026-11-18 Version 68: practice returns show decisions, field-by-field maps, the finished return and a software check; 8 new returns
- 2026-11-18 Version 67: office steps follow the Nov 17 process update, security and privacy questions
- 2026-11-18 Version 66: EDPNA case bank and three lessons, two Series 65 lessons
- 2026-11-18 Version 65: tax practice follows the OLT Pro Web workflow, with OLT videos
- 2026-11-18 Version 64: QuickBooks client jobs with realistic screens, Intuit training links, more Series 65 questions
- 2026-11-18 Version 63: section intros, harder Series 65 and EDPNA questions
- 2026-11-18 Version 62: usable items from the PASS READY document, corrected and updated
- 2026-11-18 Version 61: bigger Series 65 and EDPNA banks, calculation trainers, imported practice questions
- 2026-11-18 Version 60: Series 65 and EDPNA exam sections
- 2026-11-18 Version 59: interactive simulators - interview, tap-to-fill W-2, entry feedback, reviewer drill, try-it-yourself bookkeeping
- 2026-11-18 Version 58: lesson and flashcards on the firm's five tools
- 2026-11-18 Version 57: firm name shown as Solving Life LLC everywhere
- 2026-11-18 Version 56: office workflow in the tax simulator, 10 office practice returns, month-end close
- 2026-11-18 Version 55: practice tax software and practice QuickBooks company simulators
- 2026-11-18 Version 54: course book PDF opens from inside the course
- 2026-11-18 Version 53: Bookkeeping, QuickBooks, Taxes foundation course; section chooser at start
- 2026-11-17 Version 52: all 757 Part 1 facts recorded for background audio
- 2026-11-17 Version 51: form numbers read as 'ten forty'; more recorded facts
- 2026-11-17 Version 50: more recorded facts for background audio
- 2026-11-17 Version 49: recorded voice for audio review, plays in the background (first batch of recordings)
- 2026-11-17 Version 48: Slides tile near the top, Check for update button
- 2026-11-17 Version 47: 18 Part 1 unit lessons with form examples and diagrams
- 2026-11-17 Version 46: one-tap Save progress and Load progress, 10 new Part 1 questions
- 2026-11-17 Version 45: exam dates on the home screen, Random 10 mixed mode
- 2026-11-17 Version 44: Lessons section (slide view of every fact by topic)
- 2026-11-17 Version 43: 100 new Part 2 and 108 new Part 3 questions
- 2026-11-17 Version 42: simple Easy style, 142 new Part 1 teaching questions
- 2026-11-17 Version 41: one-tap audio, clearer look, dashboard on top, smart session, update notice
- 2026-11-17 Add EA Exam APP: installable offline study app
- 2026-11-17 Initial commit
