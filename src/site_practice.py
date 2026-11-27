"""Builds free, indexable practice-question pages for solvinglifewith.com (pwa/company/) from the question bank,
plus sitemap.xml and robots.txt. The app itself is noindex and behind sign-in, so these pages are how search engines
find it. Run after tmp/dumpbank.js:  node tmp/dumpbank.js <bank files> && python3 site_practice.py"""
import json, html, hashlib, os, re, datetime
from promo import PROMO, PROMO_CSS
B = json.load(open("/tmp/bank.json")); OUT = "pwa/company"; SITE = "https://solvinglifewith.com/"; TODAY = datetime.date.today().isoformat()
E = html.escape
EX = [
 dict(slug="enrolled-agent-exam-practice-questions", parts=[1,2,3], app="ea", name="Enrolled Agent (EA) Exam", n=36,
      title="Free Enrolled Agent Exam Practice Questions (IRS SEE, all 3 parts) with Answers",
      desc="36 free Enrolled Agent exam practice questions with answers and explanations, covering Parts 1, 2 and 3 of the IRS Special Enrollment Examination.",
      facts="The IRS Special Enrollment Examination (SEE) has three parts: Individuals, Businesses, and Representation, Practices and Procedures. Each part has 100 multiple-choice questions and lasts 3.5 hours. The current window runs July 1, 2026 to February 28, 2027 and tests tax year 2025 law. The cost is $317 per part, and PSI gives the exam. There is no education or experience requirement.",
      dn={1:"Part 1 · Individuals",2:"Part 2 · Businesses",3:"Part 3 · Representation"}, bypart=True),
 dict(slug="series-65-practice-questions", parts=[5], app="65", name="Series 65 Exam", n=30,
      title="Free Series 65 Practice Questions with Answers and Explanations",
      desc="30 free Series 65 (Uniform Investment Adviser Law Exam) practice questions with answers and plain-English explanations.",
      facts="The Series 65 is the NASAA Uniform Investment Adviser Law Examination. It has 130 scored questions plus 10 unscored trial questions, 180 minutes, and you need 92 of 130 (about 71%) to pass. The fee is $187. No firm sponsor and no experience are required."),
 dict(slug="sie-exam-practice-questions", parts=[10], app="sie", name="SIE Exam", n=30,
      title="Free SIE Exam Practice Questions with Answers (FINRA Securities Industry Essentials)",
      desc="30 free SIE exam practice questions with answers and explanations, weighted like the FINRA outline.",
      facts="The Securities Industry Essentials (SIE) exam has 75 scored questions in 1 hour 45 minutes. The passing score is 70 and the fee is $100. Anyone 18 or older can take it with no firm sponsor, and a pass is good for four years."),
 dict(slug="customs-broker-exam-practice-questions", parts=[9], app="cble", name="Customs Broker License Exam (CBLE)", n=30,
      title="Free Customs Broker Exam Practice Questions (CBLE) with Official Answers",
      desc="30 free Customs Broker License Exam practice questions, including real past CBP exam questions with the official answers and citations.",
      facts="The Customs Broker License Examination is given by U.S. Customs and Border Protection twice a year, in April and October. It has 80 questions, lasts 4.5 hours, is open book, and the passing score is 75%. The next exam is April 28, 2027. You must be a U.S. citizen and at least 21 to be licensed; no experience is required."),
 dict(slug="edpna-exam-practice-questions", parts=[6], app="edpna", name="EDPNA Exam", n=24,
      title="Free EDPNA Exam Practice Questions with Answers (Social Security Representative)",
      desc="24 free EDPNA practice questions with answers for the Social Security Administration exam for non-attorney representatives eligible for direct payment.",
      facts="EDPNA stands for Eligible for Direct Payment Non-Attorney. Passing SSA's exam lets a non-attorney representative be paid fees directly from a claimant's past-due Social Security benefits. The exam has 50 multiple-choice questions and the pass mark is 70%."),
]
def h(s): return int(hashlib.md5(s.encode()).hexdigest(), 16)
def ok(q):
    if q["ty"] or not q["e"] or len(q["w"]) != 3: return False
    if not (35 <= len(q["s"]) <= 300) or any(len(o) > 150 for o in [q["c"]] + q["w"]): return False
    if re.search(r"provided|below|above|calendar|exhibit|Practical Exercise", q["s"], re.I): return False
    return True
def pick(ex):
    pool = [q for q in B if q["p"] in ex["parts"] and ok(q)]
    key = (lambda q: q["p"]) if ex.get("bypart") else (lambda q: q["d"])
    groups = {}
    for q in sorted(pool, key=lambda q: h(q["s"])): groups.setdefault(key(q), []).append(q)
    per = -(-ex["n"] // len(groups)); out = []
    for g in sorted(groups): out += [(g, q) for q in groups[g][:per]]
    return out[:ex["n"]]
HEAD = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:url" content="{url}"><meta property="og:type" content="article">
<link rel="stylesheet" href="style.css">
<style>.pq{{border:1px solid #D9E0EA;border-radius:12px;padding:16px 18px;margin:14px 0;background:#fff}}.pq ol{{margin:8px 0 8px 22px;padding:0}}.pq li{{margin:4px 0}}.pq details{{margin-top:6px}}.pq summary{{cursor:pointer;color:#0E7C66;font-weight:600;min-height:32px}}.cta{{background:#0F1B2D;color:#fff;border-radius:14px;padding:22px;margin:28px 0}}.cta p{{color:#DDE5F0}}.cta h2{{color:#fff;margin-top:0}}
""" + PROMO_CSS.replace("{","{{").replace("}","}}") + """</style>
<script type="application/ld+json">{ld}</script>
</head>
<body>
<header class="top"><div class="wrap"><a class="brand" href="./">Solving Life LLC</a><nav class="main" aria-label="Main"><a href="./">Home</a><a href="apps.html">Study apps</a><a href="free-practice-questions.html">Free practice questions</a></nav></div></header>
<main class="page">
"""
FOOT = PROMO + """
</main>
<footer class="bottom"><div class="wrap"><span>© 2026 Solving Life LLC. Practice questions are written by Solving Life LLC unless marked as official exam questions. Not affiliated with the IRS, FINRA, NASAA, SSA or CBP.</span></div></footer>
</body></html>
"""
def cta(ex):
    return (f'<div class="cta"><h2>Want the full question bank?</h2><p>The Solving Life app has the complete {E(ex["name"])} bank with adaptive drills, mock exams and audio review. '
            f'It works on any phone, even offline. Try it free for 1 hour; $49 unlocks all five exam apps for 12 months.</p>'
            f'<p><a class="btn btn-main" href="https://study.solvinglifewith.com/{ex["app"]}/">Start practicing free</a></p></div>')
urls = []
for ex in EX:
    qs = pick(ex); url = SITE + ex["slug"]; urls.append(url)
    ld = json.dumps({"@context":"https://schema.org","@type":"Quiz","name":ex["title"],"about":{"@type":"Thing","name":ex["name"]},"educationalLevel":"professional certification",
        "publisher":{"@type":"Organization","name":"Solving Life LLC","url":SITE},
        "hasPart":[{"@type":"Question","eduQuestionType":"Multiple choice","text":q["s"],"acceptedAnswer":{"@type":"Answer","text":q["c"],"answerExplanation":{"@type":"Comment","text":q["e"]}},
                    "suggestedAnswer":[{"@type":"Answer","text":w} for w in q["w"]]} for _, q in qs]})
    o = HEAD.format(title=E(ex["title"]), desc=E(ex["desc"]), url=url, ld=ld.replace("</", "<\\/"))
    o += f'<h1>{E(ex["title"])}</h1>\n<p>{E(ex["facts"])}</p>\n<p>Below are {len(qs)} free practice questions. Pick your answer, then tap <b>Show answer</b>.</p>\n'
    last = None
    for i, (g, q) in enumerate(qs, 1):
        if ex.get("dn") and g != last: o += f'<h2>{E(ex["dn"][g])}</h2>\n'; last = g
        opts = sorted([q["c"]] + q["w"], key=lambda t: h(q["s"] + t)); L = "ABCD"[opts.index(q["c"])]
        o += (f'<div class="pq"><p><b>{i}.</b> {E(q["s"])}</p><ol type="A">' + "".join(f"<li>{E(t)}</li>" for t in opts) +
              f'</ol><details><summary>Show answer</summary><p><b>{L}. {E(q["c"])}</b></p><p>{E(q["e"])}</p></details></div>\n')
        if i == len(qs) // 2: o += cta(ex)
    o += cta(ex) + '<p>More free sets: ' + " · ".join(f'<a href="{x["slug"]}.html">{E(x["name"])}</a>' for x in EX if x is not ex) + '</p>\n' + FOOT
    open(f'{OUT}/{ex["slug"]}.html', "w").write(o); print(ex["slug"], len(qs))
# hub page
url = SITE + "free-practice-questions"; urls.append(url)
o = HEAD.format(title="Free License Exam Practice Questions: EA, Series 65, SIE, Customs Broker, EDPNA", desc="Free practice questions with answers for five license exams that need no degree or experience: Enrolled Agent, Series 65, SIE, Customs Broker and EDPNA.", url=url,
    ld=json.dumps({"@context":"https://schema.org","@type":"CollectionPage","name":"Free license exam practice questions","publisher":{"@type":"Organization","name":"Solving Life LLC","url":SITE}}))
HUB_CSS = """<style>
.hb{position:relative;overflow:hidden;border-radius:26px;padding:38px 26px 30px;color:#fff;background:linear-gradient(135deg,#102A49 0%,#14506A 55%,#158A7E 100%);margin:6px 0 26px}
.hb:before{content:"";position:absolute;right:-90px;top:-90px;width:280px;height:280px;border-radius:50%;background:#FFD23F;opacity:.16}.hb:after{content:"";position:absolute;left:-70px;bottom:-110px;width:240px;height:240px;border-radius:50%;background:#7BD0C6;opacity:.18}
.hb>*{position:relative;z-index:1}.hb .ey{display:inline-block;background:#FFD23F;color:#102A49;font-weight:800;font-size:13px;letter-spacing:1.5px;padding:7px 14px;border-radius:999px}
.hb h1{color:#fff;font-size:clamp(34px,9vw,54px);line-height:1.04;margin:16px 0 12px;letter-spacing:-1px}.hb h1 em{font-style:normal;color:#FFD23F}.hb p{color:#DCEBF5;font-size:18px;margin:0 0 20px;max-width:560px}
.hbb{display:flex;flex-wrap:wrap;gap:10px}.hbb a{text-decoration:none;font-weight:800;padding:14px 20px;border-radius:14px;background:#FFD23F;color:#102A49}.hbb a+a{background:rgba(255,255,255,.14);color:#fff;border:1.5px solid rgba(255,255,255,.6)}
.hst{display:flex;gap:22px;margin-top:24px;flex-wrap:wrap}.hst div{font-size:14px;color:#C9E4E0}.hst b{display:block;font-size:30px;color:#fff;line-height:1.1}
.tc{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));margin:0 0 34px}.tc a{display:flex;flex-direction:column;gap:8px;text-decoration:none;color:#102A49;background:#fff;border:1px solid #D9E0EA;border-radius:20px;padding:22px;box-shadow:0 8px 24px rgba(16,42,73,.08);transition:transform .15s,box-shadow .15s}
.tc a:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(16,42,73,.14)}.tc svg{width:64px;height:64px}.tc b{font-size:23px;line-height:1.15}.tc span{color:#44546A;font-size:16px}.tc i{font-style:normal;display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}.tc i u{text-decoration:none;font-size:13px;font-weight:700;background:#E6F5F2;color:#0F6B5C;padding:4px 10px;border-radius:999px}
.tc .go{margin-top:auto;padding-top:8px;font-weight:800;color:#127A68;font-size:17px}
.sec{font-size:28px;margin:8px 0 14px;letter-spacing:-.5px}.fg{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));margin:0 0 34px}.fg div{background:#F6F8FB;border-radius:16px;padding:18px}.fg div b{display:block;font-size:18px;margin:6px 0 4px}.fg div span{color:#44546A;font-size:15.5px}.fg .ic{font-size:28px;line-height:1}
.hw{counter-reset:s;display:grid;gap:12px;margin:0 0 34px;padding:0;list-style:none}.hw li{counter-increment:s;display:flex;gap:14px;align-items:flex-start;font-size:17px}.hw li:before{content:counter(s);flex:none;width:38px;height:38px;border-radius:50%;background:#102A49;color:#FFD23F;font-weight:800;display:flex;align-items:center;justify-content:center}.hw b{display:block}
.ex{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));margin:0 0 26px}.ex a{text-decoration:none;color:#102A49;border:1px solid #D9E0EA;border-radius:16px;padding:16px 18px;background:#fff}.ex a b{display:block;font-size:18px;color:#127A68}.ex a span{font-size:15px;color:#44546A}
.tx{border-radius:20px;background:#FFF6D6;border:1px solid #F1DC8A;padding:22px;margin:0 0 30px}.tx h2{margin:0 0 6px;font-size:23px}.tx p{margin:0 0 12px;color:#4A4222}.tx a{font-weight:800;color:#102A49}
</style>"""
IC_CIT='<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#102A49"/><path d="M32 54C20 40 15 33 15 26a17 17 0 0 1 34 0c0 7-5 14-17 28z" fill="#D7262E"/><polygon points="32,14 35,22 43,22 37,27 39,35 32,30 25,35 27,27 21,22 29,22" fill="#fff"/></svg>'
IC_DRV='<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#E6F5F2"/><polygon points="24,12 40,12 52,24 52,40 40,52 24,52 12,40 12,24" fill="#D7262E" stroke="#fff" stroke-width="3"/><rect x="20" y="29" width="24" height="6" rx="2" fill="#fff"/></svg>'
IC_MOT='<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#FFF1C2"/><circle cx="18" cy="42" r="9" fill="none" stroke="#102A49" stroke-width="5"/><circle cx="47" cy="42" r="9" fill="none" stroke="#102A49" stroke-width="5"/><path d="M18 42 L28 28 H40 L47 42 M28 28 L24 22 H18 M40 28 L44 21" fill="none" stroke="#102A49" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
o += HUB_CSS + f"""<section class="hb"><span class="ey">100% FREE · NO SIGN-IN NEEDED</span><h1>Pass your U.S. tests <em>faster</em></h1><p>Practice the real citizenship questions and your driver's license test on your phone. Start in ten seconds.</p>
<div class="hbb"><a href="https://study.solvinglifewith.com/citizenship/">Start the citizenship test</a><a href="https://study.solvinglifewith.com/driving/">Start the driver's test</a></div>
<div class="hst"><div><b>128</b>official citizenship questions</div><div><b>51</b>state driving pages</div><div><b>$0</b>free, always</div></div></section>
<div class="tc"><a href="https://study.solvinglifewith.com/citizenship/">{IC_CIT}<b>U.S. citizenship test</b><span>Every official civics question for the 2025 naturalization test, with answers.</span><i><u>Audio</u><u>English + Español</u><u>20-question test</u><u>65/20 list</u></i><span class="go">Open the free app →</span></a>
<a href="https://study.solvinglifewith.com/driving/">{IC_DRV}<b>Driver's license practice test</b><span>Road signs, signals and rules, with a page for every state.</span><i><u>All 50 states + DC</u><u>Answers explained</u><u>25-question test</u></i><span class="go">Start practicing →</span></a>
<a href="https://study.solvinglifewith.com/motorcycle/">{IC_MOT}<b>Motorcycle permit test</b><span>Braking, turning, gear and road hazards for new riders.</span><i><u>20-question test</u><u>Answers explained</u></i><span class="go">Start practicing →</span></a></div>
<h2 class="sec">Why people prepare here</h2><div class="fg">
<div><span class="ic">⚡</span><b>Prepare fast</b><span>A step-by-step study path tells you what to do next. Short sessions you can finish on a break.</span></div>
<div><span class="ic">🎯</span><b>Adaptive practice</b><span>The app learns what you know. Questions you miss come back until you get them right, then mock tests check you are ready.</span></div>
<div><span class="ic">🔊</span><b>Hear it out loud</b><span>The citizenship test is spoken. Every question has audio so you can practice answering by ear.</span></div>
<div><span class="ic">☁️</span><b>Save your progress</b><span>Sign in with Google or an email code and continue on any phone or computer. Works offline once opened.</span></div>
<div><span class="ic">📘</span><b>Built from official sources</b><span>The USCIS question list and state driver handbooks, with every answer explained.</span></div>
<div><span class="ic">📱</span><b>Nothing to install</b><span>Works in your phone's browser. No download, no card, no trial.</span></div></div>
<h2 class="sec">How it works</h2><ol class="hw"><li><div><b>Pick a test</b>Citizenship, driver's license or motorcycle.</div></li><li><div><b>Answer and see why</b>Each answer comes with a short explanation.</div></li><li><div><b>Repeat what you missed</b>Keep going until you pass every time.</div></li></ol>
<h2 class="sec">Next step: a U.S. career license</h2><p>Five professional licenses you can earn by passing an exam. Each page has free questions with answers and explanations.</p><div class="ex">""" + \
     "".join(f'<a href="{x["slug"]}.html"><b>{E(x["name"])} →</b><span>{E(x["desc"])}</span></a>' for x in EX) + '</div>\n' + \
     '<div class="tx"><h2>Need a tax return or an ITIN?</h2><p>We prepare U.S. tax returns from simple to complicated: individual and family, self-employed, nonresident (1040-NR), and joint returns with a non-citizen spouse.</p><p><a href="https://solvinglifellc.com">Get tax help at solvinglifellc.com →</a></p></div>\n' + \
     '<div class="cta"><h2>Study all five in one app</h2><p>Adaptive drills, mock exams, audio and free podcasts. Free for 1 hour, then $49 for all five apps for 12 months.</p><p><a class="btn btn-main" href="apps.html">See the study apps</a></p></div>\n' + FOOT
open(f"{OUT}/free-practice-questions.html", "w").write(o)
base = [SITE, SITE + "apps", SITE + "giveaway"]
import os
if os.path.exists("free/urls.txt"): base += [SITE + u.strip() for u in open("free/urls.txt") if u.strip()]
open(f"{OUT}/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"<url><loc>{u}</loc><lastmod>{TODAY}</lastmod></url>\n" for u in base + urls) + "</urlset>\n")
open(f"{OUT}/robots.txt", "w").write("User-agent: *\nAllow: /\n\nSitemap: " + SITE + "sitemap.xml\n")
