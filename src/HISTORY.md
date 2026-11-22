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
Versions 184 to 207 = the gap work: 913 new exam-style questions in twenty-four files (Part 1 438, Part 2 235, Part 3 240; `bank_p3_gap6.js` added in Version 207 with 30 stories on Circular 230 best practices, competence and money penalties, Form 2848 line 5a, the 120 days for Form 8821, refund look-back amounts, deposits, payment designation, the trust fund penalty amount, appeal courts, no levy during an installment agreement, effective tax administration offers, spousal relief, Taxpayer Assistance Orders, Fast Track Settlement, interest rates, the last known address, quashing a summons, business asset seizures, section 7216 consents, Form 941-X and e-file rules; `bank_p2_gap6.js` added in Version 206 with 36 stories on partners, S and C corporations, business deductions, payroll, trusts, estates, exempt organizations, plans and farms; `bank_p1_gap14.js` added in Version 205 with 30 stories on income, assets and advising; `bank_p3_gap5.js` added in Version 204 with 31 stories), with `bank_p2_gap4.js`, `bank_p3_gap4.js` (Version 201, 43 Part 3 stories), `bank_p1_gap13.js` (Version 202, 33 worked calculations on deductions and credits) and `bank_p2_gap5.js` (Version 203, 32 Part 2 stories on entities, payroll, fringe benefits, exempt organizations)
(`bank_p1_gap4.js` to `gap12`, `bank_p2_gap1.js`, `gap2`, `gap3` (worked calculations), `bank_p3_gap3.js` (worked stories), `bank_p3_gap1.js`, `gap2`), written from the rule cards, checked one by one against
the cards while writing. Second-reader review so far: `bank_p1_gap4.js` and `gap5.js` (Version 198, 119
questions, no errors), `gap6.js` and `gap7.js` (Version 200, 90 questions, two fixes) and `gap8.js` and `gap9.js`
(Version 201, 76 questions, no errors; one stem has a deposit on Saturday January 3, 2026, left as it is because a
Saturday deposit is possible). `gap10.js` and `gap11.js` were reviewed in Version 202 (60 questions, no errors); `gap12.js` and `bank_p2_gap1.js`
in Version 203 (95 questions, no errors; one question in the new `gap13.js` repeated the facts of a `gap12.js`
question and was given different numbers the same hour). `bank_p2_gap2.js` and `gap3.js` were reviewed in Version 204 (71 questions, no errors; one explanation, the SIMPLE
IRA limit, now also gives the higher limit for employers with 25 or fewer employees). `bank_p2_gap4.js` and `bank_p3_gap1.js` were reviewed in Version 205 (no errors in the sums or rules; one fix: the Forms W-2 and 1099-NEC answer said "January 31, 2026", a Saturday, so the answer now says January 31 and the explanation gives Monday, February 2, 2026; the stem is unchanged, so progress stays). `bank_p3_gap2.js` and `gap3.js` were reviewed in Version 206 (73 questions, no errors; one explanation, the offer in compromise and the collection period, now also gives the 30 days after a rejection and the appeal). `bank_p3_gap4.js` and `bank_p1_gap13.js` were reviewed in Version 207 (82 questions, every sum re-worked; no errors). `bank_p2_gap5.js` and `bank_p3_gap5.js` were reviewed in Version 208 (63 questions, no errors). The review found that the Indigo question in the new `bank_p2_gap6.js` repeated the Zest question of `gap5` (bonus to a 70% owner), so in Version 208 Indigo was rewritten as the 2½-month rule for an unrelated employee (new stem, so any progress on the old one, shipped 30 minutes earlier, is dropped). Still to review the same
way: `bank_p2_gap6` and `bank_p3_gap6`. Confirmed for Version 206 on irs.gov: Form 1099-K is required from a payment app only above $20,000 and 200 transactions (threshold restored retroactively by the 2025 law); a C corporation with a June 30 year end files by the 15th day of the third month and gets a 7-month extension for tax years beginning before 2026; the private foundation excise tax is 1.39% of net investment income; Form 5500-EZ is required once a one-participant plan's assets pass $250,000. Confirmed for Version 205 on irs.gov: forgiven main-home mortgage debt is excluded for discharges before January 1, 2026, up to $750,000 ($375,000 married filing separately), on Form 982; student loan discharges after 2020 and before 2026 are excluded; HSA limits for 2025 are $4,300 self-only and $8,550 family, with the last-month rule and its testing period; June 15, 2025 was a Sunday, so the second estimated payment was due June 16; 2021 returns were due April 18, 2022. Confirmed for Version 203: late Form 1065 and 1120-S penalty $255 per owner
per month for returns due in 2026 ($245 for returns due in 2025); the 2025 Form 1065 was due March 16, 2026.
Confirmed for Version 204: information return penalties for returns due in 2026 are $60, $130, $340 and $680;
first B notice within 15 business days and backup withholding no later than 30 business days after the IRS
notice; installment agreement fees $22, $69, $107, $178, low-income waived with direct debit or $43 reimbursed;
offer in compromise fee $205; minimum late-filing penalty $525 for returns due in 2026; SIMPLE $16,500 and
$3,500 catch-up ($17,600 and $3,850 for employers with 25 or fewer employees; $5,250 at ages 60 to 63). Confirmed on irs.gov on November 23, 2026 (Version 201 round): 0% capital gain bracket $48,350
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
Owner asked (November 23): "anything better than github for all my current and future needs all in one integrated
and claude connected too". Answer given: no single service does it all; keep three pieces he already has.
GitHub = the code (the only code host this Claude workspace pushes to directly). Cloudflare = hosting now and the
game server later (Workers free plan 100,000 requests a day; Durable Objects with WebSockets are on the free plan
since April 2025, which suits play-for-fun multiplayer poker, mahjong, tongits, pusoy); a "Cloudflare Developer
Platform" connector exists in the Claude directory (not connected yet; he connects it in claude.ai). Wix = sales,
accounts, login. If the Cloudflare connector is connected, check whether it can deploy the static app (about
3,000 files, 100 MB); if yes, GitHub Pro is no longer needed and can be cancelled.
CLOUDFLARE (November 23, 2026, owner: "Use Cloudflare Developer Platform for this" and "i also own 10 years
prepaid on cloudflare solvinglifewith.com"). The Cloudflare Developer Platform connector is connected in Claude
(tools `mcp__Cloudflare_Developer_Platform__*`: D1, KV, R2, Hyperdrive, list/read Workers, docs search). It cannot
create or deploy a Pages project or a Worker, and it says it is deprecated in favour of the Cloudflare API MCP
server. The account had 0 Workers and R2 not enabled. Done on our side: tmp/push_site.sh (called by tmp/ship.sh)
publishes the app-only tree (no src/, HISTORY.md, README.md; 2,551 files) to a new branch `site` with an ordinary
push; `main` and `gh-pages` are unchanged (a forced push to gh-pages was refused by the session's safety check,
so do not try that again). Owner's one-time setup, given to him: Cloudflare dashboard, Workers & Pages, Create
application, Pages, Import an existing Git repository, GitHub, ea-exam-app, production branch `site`, no preset,
no build command, no output directory, Save and Deploy. Limits checked in Cloudflare docs: free plan 20,000
files per site, 25 MiB per file, 500 builds a month, private repositories supported, 100 custom domains per
project. NEXT when he sends the pages.dev address: open it, check the app loads from the root path (it lives
under /ea-exam-app/ on GitHub), check sw.js and manifests, then add study.solvinglifewith.com as a custom domain
(his DNS is at Cloudflare) and later study.solvinglifellc.com (one CNAME in Wix). Build the "move my progress"
step before telling anyone to switch address (the app already has a backup file export and import in Settings;
make it one tap from the old address). With Cloudflare serving the private repository, GitHub Pro is not needed;
after the Cloudflare copy works and progress is moved, the repository can be made private on the free plan
(GitHub Pages then stops, so do it only when the owner says so).
t700 has about 81 checks when complete and needs about 100 s; a count of 30 or 56 is a partial read.
CLOUDFLARE UPDATE 05:45 Manila: the owner's dashboard opened the newer WORKERS flow (project name ea-exam-app,
deploy command `npx wrangler deploy`), not Pages. Made it work instead of sending him back: `pwa/wrangler.jsonc`
(name ea-exam-app, assets directory "./", no server code) and `pwa/.assetsignore` (keeps src, HISTORY.md,
README.md, .git and the config out of the site) are now in the repository (commit 0f2b39f on main). The Workers
build deploys from the default branch `main`; the `site` branch is then not needed by Cloudflare but is kept.
The Worker name in wrangler.jsonc must stay equal to the project name. He was told to switch OFF "Enable Preview
builds" (each ship pushes three branches). Address will be ea-exam-app.<his-subdomain>.workers.dev. A Workers
custom domain needs the domain's DNS on Cloudflare: study.solvinglifewith.com works; study.solvinglifellc.com
would need that domain's DNS moved from Wix, so use solvinglifewith.com for the app and link to it from Wix.
OWNER QUESTION 05:45 (why not GitHub Pro for 3 or 4 apps): answered that Pro adds nothing per app. Each app = one free private
repository + one free Cloudflare project + one subdomain of solvinglifewith.com (kids., poker., study.). Money later, in order:
Google Play $25 once, Cloudflare paid plan about $5 a month only when live game traffic needs it, Apple $99 a year. Offered: a free
GitHub organization named for the business, to do after the first app is live on Cloudflare. At 06:00 Manila workers_list still
showed no Worker, so he had not tapped Deploy yet.
CLOUDFLARE LIVE 07:00 Manila Nov 23: the owner deployed the Worker. Build log: wrangler 4.166.0 read 3103 files, uploaded 2549, address
ea-exam-app.<his-account>.workers.dev (full address is in the conversation, not here). Checked: the home page opens with Version 205,
version.json answers, HISTORY.md is refused (the .assetsignore works). Wrangler warned that workers_dev and preview_urls default to on; left
as they are for now. Next: custom domain study.solvinglifewith.com (Worker -> Settings -> Domains & Routes -> Add -> Custom domain), then the
move-my-progress card, then a business landing page for solvinglifewith.com (needed for Apple and Google organization accounts; no EIN and no
home address on it). The owner requested a D-U-N-S number for the LLC through Apple's page on Nov 23 (up to 5 business days, then up to 2 for
Apple to see it); then Google Play organization account ($25) first, Apple ($99 a year) second.
COMPANY SITE (Version 207): the owner asked for a business profile and site for all ventures. Design canvas (claude.ai artifact) has
the home page and a product page template. A static copy is in `pwa/company/` (index.html, privacy.html, terms.html, style.css,
its own wrangler.jsonc with name solvinglife-site and .assetsignore); the app Worker's .assetsignore leaves `company` out. To add a
product, add one line to the P list in company/index.html. The owner creates a second Cloudflare Worker from the same repository
with root directory `company`, then adds the custom domain solvinglifewith.com to it. No EIN, no home address, no IRS approvals
listed until issued. Selling plan: website checkout as the main shop (lowest fees), App Store and Google Play for discovery with
their in-app purchase as well; one account unlocks everywhere (account system still to build). ship.sh now credits Claude Opus 5.5.
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
