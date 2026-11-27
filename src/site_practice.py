"""Builds free, indexable practice-question pages for solvinglifewith.com (pwa/company/) from the question bank,
plus sitemap.xml and robots.txt. The app itself is noindex and behind sign-in, so these pages are how search engines
find it. Run after tmp/dumpbank.js:  node tmp/dumpbank.js <bank files> && python3 site_practice.py"""
import json, html, hashlib, os, re, datetime
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
<style>.pq{{border:1px solid #D9E0EA;border-radius:12px;padding:16px 18px;margin:14px 0;background:#fff}}.pq ol{{margin:8px 0 8px 22px;padding:0}}.pq li{{margin:4px 0}}.pq details{{margin-top:6px}}.pq summary{{cursor:pointer;color:#0E7C66;font-weight:600;min-height:32px}}.cta{{background:#0F1B2D;color:#fff;border-radius:14px;padding:22px;margin:28px 0}}.cta p{{color:#DDE5F0}}.cta h2{{color:#fff;margin-top:0}}</style>
<script type="application/ld+json">{ld}</script>
</head>
<body>
<header class="top"><div class="wrap"><a class="brand" href="./">Solving Life LLC</a><nav class="main" aria-label="Main"><a href="./">Home</a><a href="apps.html">Study apps</a><a href="free-practice-questions.html">Free practice questions</a></nav></div></header>
<main class="page">
"""
FOOT = """</main>
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
o += '<h1>Free license exam practice questions</h1>\n<p>Five professional licenses you can earn by passing an exam, with no degree and no work experience required. Each page has free questions with answers and explanations.</p>\n<ul>' + \
     "".join(f'<li><a href="{x["slug"]}.html"><b>{E(x["name"])}</b></a>: {E(x["desc"])}</li>' for x in EX) + '</ul>\n' + \
     '<div class="cta"><h2>Study all five in one app</h2><p>Adaptive drills, mock exams, audio and free podcasts. Free for 1 hour, then $49 for all five apps for 12 months.</p><p><a class="btn btn-main" href="apps.html">See the study apps</a></p></div>\n' + FOOT
open(f"{OUT}/free-practice-questions.html", "w").write(o)
base = [SITE, SITE + "apps", SITE + "giveaway"]
open(f"{OUT}/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"<url><loc>{u}</loc><lastmod>{TODAY}</lastmod></url>\n" for u in base + urls) + "</urlset>\n")
open(f"{OUT}/robots.txt", "w").write("User-agent: *\nAllow: /\n\nSitemap: " + SITE + "sitemap.xml\n")
