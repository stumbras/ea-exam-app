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
Versions 184 to 198 = the gap work: 647 new exam-style questions in sixteen files (`bank_p1_gap4.js` to
`gap12`, `bank_p2_gap1.js`, `gap2`, `gap3` (worked calculations), `bank_p3_gap3.js` (worked stories), `bank_p3_gap1.js`, `gap2`), written from the rule cards, checked one by one against
the cards while writing. Second-reader review so far (Version 198): `bank_p1_gap4.js` and `gap5.js`, 119
questions, no errors found. Still to review the same way: `gap6` to `gap12`, the three Part 2 files and the
three Part 3 files. Re-checked against irs.gov on
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
4. **Hosting.** Today the app and, since Version 183, its full source sit in a PUBLIC GitHub repository served by
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
   If Wix payments or plans turn out too limited, the fallback is a merchant of record:
   Use a merchant of record (for example Lemon Squeezy or Paddle) so sales
   tax and VAT are handled for the business; it issues a license key, the app asks for the key once and checks it
   with the provider's license API. A free part (for example the diagnostic and one topic) sells the rest. A
   web app that holds all content in one file can be copied by a determined buyer; if that matters later, serve
   paid content from a small backend after sign-in (Cloudflare Workers has a free tier).
6. **Stores, later.** Android: wrap the PWA as a Trusted Web Activity (PWABuilder or Bubblewrap); Google Play
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
