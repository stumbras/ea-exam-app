# Solving Life LLC · Study

A single-file, offline-first study app (a Progressive Web App) for professional exams, with a
built-in learning-games section for kids called **Space Academy**.

**Open the app:** https://stumbras.github.io/ea-exam-app/
**Kids-only link (Space Academy):** https://stumbras.github.io/ea-exam-app/?kids

---

## Study sections

| Section | What's inside |
|---|---|
| Bookkeeping · QuickBooks · Taxes | Foundation course: U.S. money and tax system, accounting, QuickBooks Online, preparing returns |
| EA Exam, Parts 1–3 | Enrolled Agent drill: facts, exam-style questions, calculation generators, practice cases, mock exams, slides and audio |
| Series 65 | Uniform Investment Adviser Law Exam: economics, investment vehicles, client strategies, law and ethics |
| EDPNA | Eligible for Direct Payment Non-Attorney: SSA disability programs, evaluation, evidence, appeals, fees, conduct |
| CAA · ITIN | IRS Certifying Acceptance Agent and Form W-7 practice |
| Colorado Notary | Colorado notary rules and step-by-step practice |

Study features: adaptive "smart drill" (5, 10 or 20 questions), common-mistakes review, quick decision
drills, practice cases, progress tracking and a 🔄 update button. Content is written from official
sources (IRS, SSA, NASAA, Colorado Secretary of State) and is updated as new forms and rules come out.
It is a study aid, not legal or tax advice.

## Space Academy (kids, ages 8–14)

Every subject adapts to the player: three right answers in a row (with 70%+ recent accuracy) moves a
subject up a level, two misses move it down. Hints are always available but never earn points.

- **🎤 Quiz Show:** 5-question game-show rounds with a timer and speed bonus. Categories: mix,
  flags, maps (world and U.S.), space (planets, Moon phases), Tesla & EVs, SpaceX & rockets, math
  pictures (clocks, fractions, graphs, coordinates), science, spelling bee (spoken, typed answers),
  words, code & logic, and a 🧠 Brain Scan placement round.
- **⛏️ Block Miner:** program a robot on a grid with forward, turn and loop commands.
- **♞🃏 Strategy Club:** chess puzzles checked by a built-in chess engine (captures, safe captures,
  checkmate in one, knight forks) and a Texas Hold'em poker school (hand rankings, showdowns, outs,
  pot odds, and play-chip hands against a robot with a win-chance coach). Play chips only.
- **💻 Computer Academy:** real terminal commands in a safe pretend computer for Linux (bash), Windows
  (PowerShell) and Mac (zsh), plus keyboard-shortcut missions on simulated Windows, Mac and
  Linux Mint desktops. The 🚗 **Tesla Hacker** pack has 20 pretend "hack your own game car" missions
  that teach real Linux skills: hidden files, editing config files with `>` and `>>`, `grep`, pipes,
  `wc`, `tail`, `find`, backups, file permissions (`ls -l`, `chmod +x`) and writing and running shell
  scripts, ending with three harder ELITE missions. A robot helper, Byte, explains each step, shows a
  clickable map of the folders, offers "did you mean" fixes for typos, and can type a command for the
  player (help that reveals the answer earns no points). Every finished mission shows an ACCESS GRANTED
  screen and unlocks a Tesla Drive reward.
- **🔴 Mars Colony Tycoon:** build a Mars base whose buildings each teach a real Mars science fact and
  keep earning credits while the player is away. Credits come from learning (Mission Control questions)
  and from ☄️ Asteroid Defense, a fast math-facts arcade game. Also includes 🎲 **Mars Empire**, an easy
  board game against a robot that mixes buying regions and collecting rent with building outposts,
  bases and cities, plus research labs and question cards.
- **Rewards earned by learning:** 🎟️ tickets unlock Tesla Drive and Booster Landing (a rocket-landing
  physics game). Tesla Drive has top-down drawings of the Model 3, Model Y, Model X (Falcon Wing doors
  open during turbo), Model S Plaid, Cybertruck (smashes cones) and Rocket Roadster (flies into space).
  **Road Trip** is a 60-second drive with ⚡ bolts, combos, jump ramps, a Boring tunnel, Superchargers,
  regenerative braking, an Autopilot power-up that only dodges, Brain Gate math questions and a 💡 hint
  button. **Demolition Derby** is a 75-second smash arena: steer with a Roblox-style thumbstick, tap BOOST to
  ram, and hit a score goal to level up. It has a follow camera and mini-map, momentum physics (front
  hits do double damage, side hits make cars spin), respawns for the player and for new challengers,
  repair, turbo, shield and 💣 bomb power-ups, a Monster Truck boss from level 3, and ❓ brain crates
  that give MEGA RAM for a correct math answer. A picture "How to play" screen opens before the first derby (and from
  📖 Rules anytime, which pauses the game), and an optional 🧑‍🏫 Coach walks new players through
  driving, crashing and boosting step by step. Hacker missions unlock paints, Boombox horns
  (goat, applause, robot, cow, Emissions Testing Mode) and Easter eggs (Rainbow Road, Santa Mode,
  Track Mode, light-show underglow, Bioweapon Defense Mode, Warp Speed, Mega Ramps, Derby Armor).
- **Progress:** levels per subject (math goes to level 25, algebra and geometry; chess to level 25,
  first-try-only from level 18; a perfect streak of 8 gives a double level-up), an estimated
  grade-level gauge, power-up mini lessons before new skills, a review queue for missed questions,
  daily chest and quests, badges, certificates in a Trophy Hall, a buildable base, and a prize goal a
  parent can set.
- **Grown-up corner:** learning time per day, accuracy and level per subject, work done, prize goal
  settings and certificates.
- **Sound:** synthesized sound effects, optional music, a voice buddy, recorded natural-voice clips and
  answering by voice where the browser supports speech recognition.

## Install, offline and updates

- Open the link in Chrome (Android) or Safari (iPhone/iPad) and choose **Install app** or
  **Add to Home Screen**.
- After the first visit with internet, the app works offline.
- When a new version is available, a green bar appears and the 🔄 **Update app** button installs it.
  Progress is kept through updates.
- Opening the `?kids` link on a device locks that device to Space Academy. Opening the link with
  `?study` at the end returns it to the full app.

## Privacy

Progress is stored only on the device, in the browser's local storage, with an automatic backup copy.
There are no accounts, ads or analytics. The app never asks for or stores Social Security numbers,
EINs or other ID numbers; practice forms use invented, masked examples.

## Credits

- World map shapes: Natural Earth (public domain), via the `world-atlas` package.
- U.S. state shapes: U.S. Census Bureau (public domain), via the `us-atlas` package.
- Recorded voice clips: generated with the open Kokoro-82M text-to-speech model (Apache-2.0).
  Other speech uses the device's built-in text-to-speech.
- Sound effects and music are synthesized in the browser with the Web Audio API.

Not affiliated with or endorsed by the IRS, SSA, NASAA, the Colorado Secretary of State, Tesla,
SpaceX, Apple, Microsoft, the Linux Mint project or any game company. Product names are trademarks
of their owners and are used only to describe what is being taught.

## Repository layout

This repository holds the built app that GitHub Pages serves:

- `index.html`: the whole app (HTML, CSS and JavaScript in one file)
- `sw.js`: the service worker that makes the app work offline
- `manifest.webmanifest`, `manifest-kids.webmanifest`: install settings for the study app and Space Academy
- `audio/`, `voice/`, `video/`: recorded audio, voice clips and the cartoon video
- `course-book.pdf`: the printable course book
- `version.json`: the current version, used by the update button

© Solving Life LLC
