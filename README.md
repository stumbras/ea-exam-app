# Solving Life LLC · Study

A single-file, offline-first study app (a Progressive Web App) for professional exams, with a
built-in learning-games section for kids called **Rocket Genius**.

**Open the app:** https://stumbras.github.io/ea-exam-app/
**Kids-only link (Rocket Genius):** https://stumbras.github.io/ea-exam-app/?kids

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

**Quick decisions** (one-tap drills with progress bars) now also cover earned vs unearned income,
Schedule 1 vs Schedule A (above vs below the line), taxable vs non-taxable, losses/carryovers/NOLs and
borrowing, step-up and estate basics (Part 1); employee vs independent contractor and accounting choices
(Part 2); penalties, statutes of limitation and who can represent taxpayers (Part 3).

## Rocket Genius (kids, ages 8–14)

Every subject adapts to the player: three right answers in a row (with 70%+ recent accuracy) moves a
subject up a level, two misses move it down. Hints are always available but never earn points.

- **Smart review no longer repeats the same questions (Version 158):** bug fix in Quick decisions. A question that was missed and then answered right stayed in review box 0, and box 0 had a zero-day interval, so it counted as "due" forever and "Review more" served the same questions round after round (in a simulation, 10 missed questions were asked 40 times in four back-to-back rounds, one of them 6 times). Now: a miss is asked again once at the end of the same round; right on that second try moves it to tomorrow (box 1); missed twice, it rests 10 minutes before Smart review may ask it again; any question just answered rests 10 minutes. The same simulation now asks those 10 questions 21 times in total, spread over two sittings, then the next day. Older saves with questions stuck in box 0 are read as box 1, so nothing needs resetting. The Smart review button shows "N missed, back in M min" while questions rest, and the end screen only offers more review when different questions are due.
- **Tidy pass: shorter screens, the Go button first (Version 157):** an audit crawled every screen at phone size (about 55 kids screens and all 8 study sections; no script errors, no broken text) and found start pages that had grown to 2 to 6 screens. Kids app: Sky Pilot briefing went from about 5,580 px to about 1,800 (missions first as short rows, only the next mission shows its lesson, flight manual and pilot settings fold away); Brick Bay opens with the Drive button under the title (2,170 px to one screen; how-to and building list fold away); Tesla Drive keeps the Drive button pinned at the bottom of the screen, the garage folds, and the "earn a ticket" card only shows under 3 tickets; Learning Center shows activities first with the 67-tile Explorer map folded (3,640 px to 1,100); Daily Genius folds its 27-topic list; Booster Landing shows locked levels as short rows; Mission Path shows the next step big and the other two as one-line rows. Fixed: the "missed you" badge and the Learning Center status pill were cut off on the home tiles. Study app: Quick decisions and step-by-step cases show the next 3 unfinished rounds with "Show all" for the rest (Part 1 home 4,160 px to 3,120); the install note moved below the study sections so the red Do-this-next button is at the top; Colorado notary path opens only the step to do now (others open on tap, ticking a step opens the next) and no longer scrolls sideways (the page was 504 px wide on a 390 px phone). Nothing was removed: every folded section opens with one tap and remembers that it is open.
- **Chess coach, landing computer, traffic lights, EA Parts 2 and 3 exam packs (Version 156):**
  - *Robot Chess coach:* every move is graded against the engine's best move (Best, Good, Inaccuracy, Mistake, Blunder) with the reason and the better move; Take back (counts like a hint); an advantage bar; danger alerts for a piece about to be lost (robot levels 1 to 6 only); opening names and three opening principles; a game review with accuracy, counts and the biggest miss shown on the board.
  - *Booster Landing flight computer:* a marker under the rocket shows where it would stop if the engine fired now (v squared over 2a), with Get ready and BURN NOW cues: the real hoverslam. Cold-gas thruster puffs, exhaust smoke, engine glow on the pad, and scenery for the launch site, ocean, Moon and Mars.
  - *Brick Bay traffic lights:* working signals at all 16 intersections. Traffic stops on red. Stopping on red and going on green pays a growing Safe Driver bonus; running a red costs a small ticket, never during a mission or a chase.
  - *EA Part 2:* 38 exam-style questions (entity and return forms, 2025 amounts such as Section 179 $2,500,000 / $4,000,000, 100% bonus after Jan 19 2025, $31 million gross receipts test, due dates, comparisons).
  - *EA Part 3:* 36 exam-style questions (2848 vs 8821, 12153, 9465, 656, 911, 8867, 8879, 8948, 14039; penalties, CE hours, PTIN fee $18.75 for 2026, minimum late-filing penalty $525; 30/90-day and 10-year deadlines; Circular 230 comparisons). The red Do this next button offers these packs on Parts 2 and 3.
- **Sky Pilot 3, Tesla Drive 3 and retina-sharp games (Version 155):**
  - *Every game canvas is now retina sharp:* drawn at up to 2x pixels (it was 1x and looked soft on an iPhone). If a phone cannot hold a smooth frame rate, the game steps the sharpness down by itself and remembers it.
  - *Sky Pilot physics:* propeller thrust fades with speed and slow flight adds induced drag, so a too-steep climb bleeds speed and stalls (Cessna climbs about 5 m/s at 8 degrees, glides about 6.6:1 with no engine). Banked turns need back pressure and raise the stall speed; a G meter shows the load. Buildings are solid.
  - *Sky Pilot world:* a real airport (apron, taxiway, terminal, control tower, hangars), the town of Brick Bay with 3D buildings and roads, runway edge lights, green/red threshold lights, working PAPI lights, a sun, sunset flights with lit runways, wingtip vapor trails.
  - *Sky Pilot approach aid:* PAPI + centerline needle panel on final approach, radio-altimeter callouts (100, 50, 20, 10), "too low, gear" warning.
  - *Sky Pilot fixes:* the radio panel no longer covers the mission quiz or checklist; rain no longer draws over the instruments; the weather badge no longer overlaps messages.
  - *Tesla Drive physics:* sideways momentum, so the car leans into lane changes and slides wider on wet (64% grip) and snowy (50% grip) roads; regen braking is weaker on low grip. Lane dashes now scroll at the same speed as the road objects.
  - *Tesla Drive traffic:* cars signal with a blinker for a second before changing lanes, only move when there is room, and show brake lights when you close in. Moving over early earns a Smooth Pass bonus.
  - *Tesla Drive look and sound:* worn asphalt, guard rails, ground detail, skid marks, tire spray, brake glow with regen arrows, speed streaks, wind noise that rises with speed, power/regen meter, range estimate, grip badge.
  - *Tesla Drive trip computer* at the end: top speed, Wh per mile, regen recovered, smooth passes and a 5-star driver rating with one coaching tip.
- **Guided everywhere, Career Labs and Genius Hospital (Version 154):**
  - *Study apps:* every home page now starts with one red pulsing **Do this next** button (course: the next lesson, cards, quiz or practice job; exam parts: misses, then the new exam-style drill, then Smart drill). Everything else is folded under one line, so the guided path is the default and free choice is one tap away.
  - *EA Part 1:* 69 new exam-style questions (form and schedule routing, exact 2025 thresholds, timing and deadline rules, "which taxpayer" comparisons), written after a 2-of-10 on an outside practice set. New **Exam-style** drill button.
  - *Colorado notary:* an 11-step path to the commission with tappable and copyable official links (SOC Learns sign-up and login, training, exam, affirmation form, application, handbook, rules), with checkboxes and the current step marked.
  - *Kids, Career Labs:* real jobs instead of questions. **Genius Hospital** (living body map with 61 parts in 4 layers and a back view, heartbeat that speeds up with Rest/Walk/Run, Find It scans, ER patients examined by tapping the body, Body Systems Tours, Germ Lab on viruses, immunity, vaccines and medicine, Pharmacy, Operating Room; rooms open as rank climbs from Med Student to Surgeon General), **Cyber Inbox**, **Courtroom**, **Business Boss** with a profit report, **Circuit Lab**. Ranks Rookie to Legend; labs open one at a time.
  - *Kids, Desktop Lab:* 12 real point-and-click tasks each on Windows 11, macOS and Linux Mint (folders, move, rename, trash and restore, Wi-Fi, dark mode, app store, frozen app, search, updates).
  - *Kids, structure with freedom:* warm-up step 1 is now a choice of three (lesson, computer task, career lab), each picked from what he has not touched. A one-question access check opens each game once per session (5 passes = a ticket). Brick Bay hospital, courthouse and workshop open the matching lab and keep their quick job.
  - *Kids, content:* 7 body and medicine topics (105 questions), 7 computer topics, a 10-lesson Human Body track; Explorer map covers labs, desktop tasks and shortcuts.
  - *Progress safety:* daily snapshots, an IndexedDB copy, automatic restore if progress ever looks smaller, and Save/Load progress file in the grown-up panel.
- **Realistic Sky Pilot (Version 153):**
  - **Honest landings:** the throttle-off trick is gone. Flaps and gear add real drag, a hands-off idle glide stalls, and the easy-mode cushion only helps a powered approach. Stalled touchdowns, nose-first touchdowns and touchdowns above 2× stall speed crash. Above 1.6× the plane bounces, and running off the runway end crashes. A STALL warning flashes with a stall horn.
  - **Weather every flight:** clear, cloudy, rain with turbulence, or a thunderstorm (dark low clouds, lightning and thunder, gusts, crosswind drift). Flying into a cloud whites out the view.
  - **Emergencies on some flights:** engine failure, rough engine, bird strike (cracked windshield), stuck gear (crank it down by tapping GEAR 3 times) and a fuel leak with a countdown. A safe engine-out landing earns +100 and the Dead-stick hero trophy.
  - **Air traffic control:** the tower and departure controller talk to the pilot, out loud. He picks the right reply: takeoff and landing clearance readbacks, climb and heading, traffic at clock positions, storm warnings, and MAYDAY vs PAN-PAN. Each right reply is +15.
  - **Crash physics:** flying debris, fire and smoke, screen shake and a flash. Hot-air balloons, birds and other traffic appear in the sky.
- **Brick Bay as the game hub (Version 152):** 10 new buildings to walk into. Chess Club, Poker Room, Mahjong Parlor, Arcade, Game Show Studio, School, Hacker HQ and Airport each open a door menu into those games, and the city waits, with a "Back to Brick Bay" button. **Bank Vault** and **City Control** are hacking missions (3 Computer Lab puzzles: commands, binary, passwords, phishing, code) worth big city money and trophies. During a police chase, the Airport offers **Escape by air** into flying. Quick decisions now keep stats (answered, % right, last 20, best streak) on the Brick Bay start screen.
- **Calmer kids home and hubs (Version 151):** home is now Mission Path, Tesla World, one Daily Genius button and five hub tiles (Brick Bay City, Pilot School, Learning Center, Game Room, My Progress). Hubs with skipped activities pulse red with bonus tickets.
  - **Daily Genius** is one button with today's 4 checks (curious, creative, teaser, Genius Quiz), accuracy and a day streak. Its screen shows performance by topic, weakest first.
  - **Robot Chess:** full games against a robot with 12 levels (from random moves up to a deeper search). Win to level up (+2 tickets, +1 with hints); two losses in a row step it down. Linked from Chess Quest and the Game Room.
  - **Game limits:** each game (Brick Bay, flying, Tesla Drive, Mars Colony, Robot Chess, Mechazilla) gets 12 minutes between learning rounds, with a warning 2 minutes before. Then it rests until any learning round. Grown-ups can set 8, 12, 20 or 30 minutes, or off. Free Passes still work.
- **Tesla World up top (Version 150):** a big Tesla World banner sits right under the Mission Path on the kids home. All Tesla games are inside the hub: Tesla Drive & Derby (moved off the home screen), Mechazilla Catch, the Tesla World Quiz (earns tickets) and Tesla Hacker (opens the terminal on the Tesla pack).
- **One Genius Quiz (Version 149):** the 13 separate topic tiles (lawyer, entrepreneur, scientist, engineer, doctor, inventor, Air Force, Space Force, cyber, USA, Europe, Asia and world history) are now one **Genius Quiz** that mixes them, favoring the weakest topics. It earns tickets, sits in the Mission Path rotation as one item, and flashes red with bonus tickets when skipped. The topics show as small achievement badges that light up and level up (every 5 right answers in a topic).
- **Tesla World (Version 148):** a new kids hub for Elon Musk's companies: Tesla (cars, Cybercab, Optimus, Megapack), SpaceX (Falcon 9, Dragon, Starship, Mechazilla chopsticks, Starlink, and xAI since February 2026), The Boring Company (an animated Vegas Loop map with a Tesla driving the tunnels, stations, Prufrock, Nashville and Bastrop) and Neuralink. 21 new Tesla World quiz questions give tickets. New game: **Mechazilla Catch**. Answer a question to fuel the booster, then burn and steer to catch it in the tower's chopsticks. Each level falls faster with more wind, and there are two trophies.
- **Kids guided mode with limited overrides (Version 147):** step 1 of the Mission Path is still required. When Tomas taps something else, a card offers "Do step 1 now" or a Free Pass. He earns a Free Pass by finishing the whole Mission Path (holds at most 2, starts with 1); each one opens 10 minutes of free play. The grown-up screen has a 30-minute unlock. Tickets still count during free play, and step 1 stays required afterwards with its bonus waiting.
- **Foundation Course as its own app (Version 146):** open https://stumbras.github.io/ea-exam-app/?course&name=Cristy to install the Bookkeeping · QuickBooks · Taxes course with its own green icon, "Foundation". It opens on a welcome screen: progress ring, one "Continue" button that always knows the next step, today's 20-minute plan, a 6-stage path and 12 job skills that fill up as they're proven.
  - **Journal Entry Lab:** 30 kinds of real business events (receipts, bills, bank lines, payroll, month-end) with fresh numbers. Pick each debit and credit, then see the entry, the T-accounts and the accounting equation update. Missed kinds come back more often.
  - **Run Solving Life LLC:** a year of the business from December 2026 to November 2027, with 24 decisions and the real 2027 deadlines (PTIN, WISP, 1099-NEC at $2,000, Form 7004, Form 8879, payment plans, Form 941 on August 2, the Colorado periodic report). Cash, clients, reputation and compliance meters, a rule for every choice, and a year-end score.
  - **Daily workout:** 22 job-math drills (payroll 2026, bank reconciliations, depreciation, sales tax, 2/10 net 30, taxable income and 2026 brackets, 2026 mileage at 72.5¢ and 76¢, SE tax, safe-harbor estimates, 1099 counts). Same 4-choice teaching as the EA drills.
  - 2026 mileage corrected to 72.5¢ through June 30 and 76¢ from July 1 (IRS Announcement 2026-11).
- **Calculations like the real exam (Version 145):** the SEE is all multiple choice, so every calculation is now 1 of 4 choices. Wrong choices are the usual mistakes (an in-between number from the working, a slipped rate). Stuck? Open a worked example with other numbers, reveal one step at a time (a right answer then counts as practice), or tap "I don't know, teach me": you get the full working and a fresh problem of the same kind right after.
- **Smart drill v2 (Version 144):** the home Smart drill no longer repeats facts you just got right. Each 10-question round mixes misses, a few due reviews, your 3 weakest areas at a climbing level (only hard questions once an area is at 75%+), and 2–3 calculations. Facts drop to about 1 in 4. 53 new hard scenario questions were added for Parts 2 and 3.
- **Smart drills (Version 143):** every drill question has its own memory (spaced-repetition boxes: missed
  questions come back right away, then after 1, 3, 7 and 21 days as they stick). Each round asks missed and
  due questions first and re-asks any miss at the end. A ⚡ Smart Review pulls the most-due questions from
  every drill in the part. The drill list shows mastered questions and accuracy, with weak drills in red.
- **📽️ Drills by course video:** 20 drill sets, 8 questions each, one per video of the free EA Tax Training
  2026 course (Part 1: 7 videos, Part 2: 9, Part 3: 4), written fresh with tax-year-2025 law including OBBBA.

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
  The 📱 **Termux** pack has 15 missions for the real Termux app on Android: `pkg update`,
  `pkg install`, phone storage permission, finding the phone's network address, `ping`, installing
  OpenSSH, logging in to the home PC with `ssh` (with a parent's permission and setup), and, at ELITE
  level, SSH keys (`ssh-keygen`, `ssh-copy-id`). Each mission shows a "try it for real in Termux" tip.
- **🔴 Mars Colony Tycoon:** build a Mars base whose buildings each teach a real Mars science fact and
  keep earning credits while the player is away. Credits come from learning (Mission Control questions)
  and from ☄️ Asteroid Defense, a fast math-facts arcade game. Also includes 🎲 **Mars Empire**, an easy
  board game against a robot that mixes buying regions and collecting rent with building outposts,
  bases and cities, plus research labs and question cards.
- **🌴 Brick Bay:** an original, kid-friendly, old-school top-down city game in a toy-brick style
  (studded buildings, minifig-style people who dive out of the way, palm trees, flamingos, a beach
  and an ocean). It has a joystick, boost and Boombox honk, traffic, a sunset-to-night cycle with
  street lights, a synth/8-bit radio, stunt ramps, speed cameras with a silly cartoon police chase
  (shake them off at the Spray Shop), and 10 hidden gems. Missions: 🍪 Cookie Caper (escape the
  Cookie Cops to the Secret Hideout), 🎈 Balloon Grab, 🕵️ Undercover Cop (catch the Cake Bandit),
  🍕 Pizza Rush and 🚕 Taxi. They teach compass directions (NORTH is up, "the hideout is SOUTH-EAST"),
  street-address map reading, and money math (making change and multiplying for bonus tips).
  Players can hop out and walk, take any parked car (Cyber Tank, Cybertruck, Roadster, police car,
  ice-cream truck), and walk into four career buildings for a three-question job: 🏦 Bank (interest
  and making change), 🏥 Hospital, ⚖️ Courthouse and 🔬 Science Lab. Cartoon robber bots sometimes
  rob the bank; players catch them by bumping them with a car or with a foam "splat" on foot.
  ⚡ Quick-decision questions (times tables, change, road safety, phishing, compass) pop up for six
  seconds and build a 🔥 combo multiplier for a 🏆 score.
  Two ✈️ jets wait on the beach: take off, fly over the buildings through five gold sky rings
  (guided by an arrow and compass words like NORTH-EAST), answer a pilot question (speed × time,
  km to meters, thrust, compass), then land on any road, park or beach.
- **✈️ Sky Pilot:** a kid-friendly 3D flight simulator with simplified real physics in metric units
  (m/s, km/h, meters). A live forces panel shows lift, weight, thrust and drag; stall speed drops when
  flaps are down, and gear and flaps add drag. Six missions unlock in order: 🛫 First Takeoff,
  ⭕ Ring Run (turning by banking), 🛬 Smooth Landing (gear, flaps, throttle and green approach hoops,
  scored by touchdown sink rate), 🚀 Rocket Watch (navigate by compass to a launch pad and watch a
  liftoff), 🏝️ Island Hop (fly over the ocean and land on an island airstrip) and 🌤️ Free Flight.
  Easy mode helps level the wings, trims for a gentle glide with gear and flaps down, and softens the
  touchdown; Pro mode turns the helpers off. Optional real-pilot stick (pull back to climb) and
  tilt-to-fly with the phone's motion sensor. Each finished mission ends with a pilot science
  question (four forces, stalls, flaps, headings, m/s to km/h, the Wright brothers).
  After First Takeoff, a ⚡ fighter jet unlocks: twice the thrust, takes off at 35 m/s and needs a
  longer landing.
  Military-style missions (after Island Hop): 🎖️ Formation Flight (hold position behind a lead jet,
  with auto-throttle), 💥 Sound Barrier (afterburner to Mach 1 = 343 m/s with a sonic boom), and
  🚁 Search & Rescue (find orange signal smoke and pass low to drop supplies). Jets show a Mach number
  and a G-meter with a G-LOC warning. In Rocket Watch, the booster now flies back and lands.
  More aircraft: a 🚁 helicopter (throttle is the collective: 50% hovers) for Helicopter Rescue (hover
  over signal smoke to hoist a hiker), an MQ-9 Reaper 🛩️ drone for Drone Recon (photograph three
  targets from 150 to 700 m), and 🎯 Missile Defense (lock on to practice target drones with a radar
  scope, then fire heat-seeking practice missiles).
  Navigation: a live 📍 GPS grid square (A–H, 1–8) and a toggle 🗺️ map with runways, the island,
  mountains and the launch pad. The 🧭 Navigator mission has no arrow: air traffic control radios a
  compass heading, a grid square and an altitude to hold for three legs. The menu has a pilot-instruments
  card (compass, altimeter, airspeed, vertical speed, GPS grid, runway numbers, wind).
  Each mission uses a real aircraft, easiest first: Cessna 172 (first takeoff, rings, landing), T-6 Texan II
  trainer, Boeing 737 (slow to respond, bigger stall speed), F-35, a rescue helicopter and the MQ-9 drone.
  Runway starts begin with a tap-through pre-flight checklist. An optional 👁️ cockpit view shows the six-pack
  (airspeed in knots, attitude indicator, altimeter in meters and feet, turn coordinator, heading, vertical
  speed). Free Flight lets him pick any aircraft he has flown.
- **♠️ Poker Academy:** seven step-by-step lessons (cards and ranks, hand rankings, best 5 of 7, how a hand
  goes, No-Limit betting, starting hands and position, pot odds), each 5 generated questions with a 4/5 pass
  mark and a ticket for the first pass. After step 3, a full No-Limit Texas Hold'em table opens: him plus
  Robo, Lucky and Shark (different styles), blinds 10/20, a moving dealer button, min-raise rules, a raise
  slider with ½-pot, pot and all-in buttons, correct side pots at showdown, and a coach showing his hand,
  win chance and pot odds, plus a one-line review after each hand. Play chips only.
- **🧭 Today's Mission Path:** the home screen leads with three daily steps picked from his weakest skills,
  each showing level-up progress. Finishing all three pays +2 🎟️. Tapping a game before the path is done
  shows a friendly reminder, but free play is never blocked.
- **🀄 Filipino Mahjong (Manila style):** six lessons (tiles, sets, the 5-sets-plus-a-pair winning hand, turns and
  claims, which tile wins, smart discards) with generated questions, then full games against Dragon, Panda and
  Fox: 16 tiles each (dealer 17), flowers set aside and replaced, chow only from the player on your left, pung
  and kong from anyone, Mahjong claims first, self-drawn wins, concealed kongs, a 'waiting for' helper, a
  💡 discard hint, and simple scoring (self-drawn, flowers, concealed, all pungs, one suit). A win pays 🎟️.
- **🔗 One chain:** every learning activity (quizzes and hero skills, lessons, music, chess, hacker missions,
  Poker Academy, mahjong, Block Miner, Mission Control, Asteroid Defense) feeds the rotation, the Mission Path,
  the skipped-activity bonus and the ticket economy. In guided mode (on by default; switch in the Grown-up
  corner), the day's most-skipped activity is Mission Path step 1 and must be won once before anything else opens.
- **✈️🚀 Pilot School hub:** Sky Pilot, Booster Landing and Space Mission now live in one hub on the home
  screen, with a ground school (Pilot Basics and Air & Space Force lessons, Air Force, Space Force and SpaceX
  quizzes) that earns the tickets the flying costs.
- **🏛️ History:** USA, Europe, Asia and World history as four leveled Quiz Show subjects that also feed
  Mix, the rotation and the Daily Genius meters.
- **Stricter rotation:** three winning rounds in a row of the same quiz stop paying tickets until he
  switches, and the brain-mix picks put his weakest skills first.
- **🔴 Skipped activities:** the three learning activities he has skipped longest (3+ days or never) and
  one skipped game pulse red on the home screen. Coming back to a skipped learning activity pays a
  🔴 comeback bonus ticket, and every Sky Pilot mission pays +1 🎟️ the first time it's finished.
- **♟️ Chess ramps up faster:** 3 of every 4 steps are puzzles, 2 first-try solves in a row level up
  (3 in a row double), harder mates and forks arrive by level 5 to 7, and from level 10 only the first
  try counts.
- **🧠 Genius Path:** nine hero skills, each a Quiz Show subject with four difficulty tiers and endless
  generators where it fits: ⚖️ Lawyer Brain, 💼 Entrepreneur, 🔬 Scientist, ⚙️ Engineer, 🩺 Doctor,
  💡 Inventor, 🎖️ Air Force Pilot, 🛰️ Space Force and 🛡️ Cyber Defender. They show up in the rotation,
  every third Mix question, Brick Bay buildings (including a 💡 Invention Workshop and an 🎖️ Air & Space
  Base) and the rocket quizzes. The home screen has a 🧠 Daily Genius card: a curious "why" question, a
  creativity challenge and a brain teaser (all three = 🎟️), plus skill-level meters for every hero.
  New lesson tracks: Think Like a Lawyer, Entrepreneur Skills, Inventor's Workshop, Air Force & Space Force.
  One ticket = a 5-minute visit. No crime or violence: everything is cartoon mischief.
- **🔄 Smart rotation:** a daily "brain mix" suggests three activities he hasn't done yet; the first win at each
  one each day gives a bonus ticket (up to 4), and after three rounds of the same thing it suggests switching.
  Every play game's end screen (Brick Bay, Sky Pilot, Booster Landing, Space Mission, Derby, Tesla Drive) shows
  an "Earn your next ticket" card with two fresh learning picks. Chess promotions and Hacker/Termux missions count too.
- **🎓 Genius Lessons:** bite-size tracks from Kid to Elite (3 cards + 2 questions each): Money & Economy,
  Government & Law, ⚖️ Law & Courts (rights, the courtroom, civil vs criminal cases, contracts, becoming a lawyer),
  Crypto & Blockchain, How Hacks Happen (ethical cyber defense), Medicine & Body,
  Engineering & Space, and Science Careers, each ending with real career paths.
- **🎵 Music Lab:** note reading on the treble staff (4 adaptive levels), an on-screen piano, play-along songs
  (Hot Cross Buns, Mary Had a Little Lamb, Twinkle Twinkle, Ode to Joy) where the microphone checks each
  note played on a real keyboard or recorder (with recorder fingerings), a tuner with guitar string notes,
  and an 8-beat composer.
- **📱 Phone Powers:** tests for tilt, microphone, vibration and voice, with step-by-step permission settings
  for Pixel/Android and iPhone. Tilt steering is smoothed, auto-centers, and works in landscape too.
- **Rewards earned by learning:** 🎟️ tickets unlock Tesla Drive and Booster Landing 2.0, a rocket-landing
  physics game with 10 levels: Landing Zone, Droneship, Windy Droneship, Night Landing (deploy the legs
  yourself), Moon (1/6 gravity), Mars (38% gravity and dust gusts), Tower Catch (the chopsticks close),
  Starship Flip (tap FLIP to swing upright), Asteroid Field and a Falcon Heavy boss with two boosters
  landing at once. It has sonic booms, altitude callouts, 1-3 star ratings, a fact for each level, and a
  Mission Control question before launch: a correct answer gives +15% fuel. It also has 🌍 **Space Mission**, a mini
  Kerbal-style game. A rocket builder (capsule, 1-3 fuel tanks, Spark or Raptor engine, parachutes or
  legs) shows mass in tonnes, weight and thrust in kN and the thrust-to-weight ratio (it must be above
  1 to lift off). Then the player flies a whole mission: countdown, liftoff, gravity turn, Mach 1, Max-Q,
  stage separation at 70 km, the Kármán line at 100 km, orbit at 200 km (7.8 km/s, grab stars, dodge
  space junk, dock with the space station), deorbit burn, re-entry (keep the heat shield angle; real
  plasma temperatures around 1,400 °C and a comms blackout), and a parachute splashdown or a Starship
  flip-and-land. It uses metric units throughout and is designed to be easy: there is no failing,
  running out of fuel gets an emergency boost, and the score and stars reward good flying. Tesla Drive has top-down drawings of the Model 3, Model Y, Model X (Falcon Wing doors
  open during turbo), Model S Plaid, Cybertruck (smashes cones), Rocket Roadster (flies into space) and a cartoon Cyber Tank (treads and a turret: it crushes cones and robot cars, 💥 FIRE clears its lane in Road Trip, and it shoots cannon shells in Demolition Derby).
  **Road Trip** is a 60-second drive with ⚡ bolts, combos, jump ramps, a Boring tunnel, Superchargers,
  regenerative braking, an Autopilot power-up that only dodges, Brain Gate math questions and a 💡 hint
  button. **Demolition Derby** is a 75-second smash arena: tap where to drive or steer with a Roblox-style thumbstick, tap BOOST to
  ram, and hit a score goal to level up. It has a follow camera and mini-map, momentum physics (front
  hits do double damage, side hits make cars spin), respawns for the player and for new challengers,
  repair, turbo, shield and 💣 bomb power-ups, a Monster Truck boss from level 3, and ❓ brain crates
  that give MEGA RAM for a correct math answer. It also has ⚡ ZAP lightning shots (5 shots that recharge), 🚀 homing-rocket pickups, and from level 2 the other cars shoot slow orange balls back. A fixed joystick sits bottom-left. The 🧑‍🏫 Coach is off unless switched on. A picture "How to play" screen opens before the first derby (and from
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
- Opening the `?kids` link on a device locks that device to Rocket Genius. Opening the link with
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
- `manifest.webmanifest`, `manifest-kids.webmanifest`: install settings for the study app and Rocket Genius
- `audio/`, `voice/`, `video/`: recorded audio, voice clips and the cartoon video
- `course-book.pdf`: the printable course book
- `version.json`: the current version, used by the update button

© Solving Life LLC
