"""Builds the free driver's license and motorcycle permit practice pages in pwa/company/:
drivers-license-practice-test.html (hub), motorcycle-permit-practice-test.html, and one page per state and D.C.
Questions are in free/car.txt and free/moto.txt (question|right|wrong|wrong|wrong|explanation), written by Solving Life LLC to
cover rules and signs that hold in every state. State-specific rules (speed limits, test length, fees) are NOT included yet:
each state page says so and points to the official state handbook. Also writes free/urls.txt for the sitemap."""
import json, html, hashlib
from promo import PROMO, PROMO_CSS
E = html.escape
def load(f): return [dict(zip("qcabxe", [p for p in l.rstrip("\n").split("|")])) for l in open(f, encoding="utf-8") if l.strip()]
def norm(rows): return [dict(q=r["q"], c=r["c"], w=[r["a"], r["b"], r["x"]], e=r["e"]) for r in rows]
CAR, MOTO = norm(load("free/car.txt")), norm(load("free/moto.txt"))
STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
slug = lambda s: s.lower().replace(" ", "-") + "-permit-practice-test"
SITE = "https://solvinglifewith.com/"
h = lambda s: int(hashlib.md5(s.encode()).hexdigest(), 16)
CSS = """.cta{background:#0F1B2D;color:#fff;border-radius:14px;padding:22px;margin:28px 0}.cta p{color:#DDE5F0}.cta h2{color:#fff;margin-top:0}.cta a.lk{color:#9FE1CB}
.tool{border:1px solid #D9E0EA;border-radius:14px;padding:18px;background:#fff;margin:18px 0}.prog{color:#44546A;font-size:14px}
#quiz h2{font-size:21px;margin:6px 0 12px}#quiz button{display:block;width:100%;text-align:left;min-height:48px;font-size:16px;border-radius:10px;padding:12px 14px;margin:8px 0;border:1px solid #9AA8BC;background:#fff;color:#0F1B2D;cursor:pointer}
#quiz button.ok{background:#E1F5EE;border-color:#0E7C66}#quiz button.no{background:#FDECEA;border-color:#B42318}#quiz button.go{background:#0E7C66;color:#fff;border-color:#0E7C66;font-weight:600;text-align:center}
.pq{border:1px solid #D9E0EA;border-radius:12px;padding:14px 16px;margin:12px 0;background:#fff}.pq ol{margin:8px 0 8px 22px;padding:0}.pq summary{cursor:pointer;color:#0E7C66;font-weight:600;min-height:32px}
.states{columns:2;list-style:none;padding:0}.states li{margin:6px 0}"""
JS = """const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
function shuf(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
let S;function start(){const st=shuf(B.slice(0,NS)).slice(0,Math.min(NS,15)),rest=shuf(B.slice(NS)).slice(0,N-st.length);S={qs:shuf(st.concat(rest)),i:0,ok:0,bad:[]};show()}
function show(){const d=S.qs[S.i];S.o=shuf([d.c].concat(d.w));S.done=0;
 $("quiz").innerHTML='<p class="prog">Question '+(S.i+1)+' of '+S.qs.length+' · correct: '+S.ok+'</p><h2>'+esc(d.q)+'</h2>'+S.o.map((t,k)=>'<button onclick="pick('+k+')">'+esc(t)+'</button>').join('')+'<div id="fb"></div>'}
function pick(k){if(S.done)return;S.done=1;const d=S.qs[S.i],bs=$("quiz").querySelectorAll("button"),r=S.o.indexOf(d.c);bs[r].className="ok";if(k===r)S.ok++;else{bs[k].className="no";S.bad.push(d)}
 $("fb").innerHTML='<p>'+esc(d.e)+'</p><button class="go" onclick="next()">'+(S.i+1<S.qs.length?'Next question':'See my score')+'</button>'}
function next(){S.i++;if(S.i<S.qs.length)return show();const p=Math.round(100*S.ok/S.qs.length);
 $("quiz").innerHTML='<h2>Your score: '+S.ok+' of '+S.qs.length+' ('+p+'%)</h2><p>'+(p>=80?'Good. Most states require between 70% and 88% to pass.':'Keep practicing. Most states require between 70% and 88% to pass.')+'</p>'+
 (S.bad.length?'<p><b>Review:</b></p><ul>'+S.bad.map(d=>'<li>'+esc(d.q)+' <i>'+esc(d.c)+'</i></li>').join('')+'</ul>':'')+'<button class="go" onclick="start()">Try a new test</button>'}"""
CTA = ('<div class="cta"><h2>From Solving Life LLC</h2><p>We prepare tax returns from simple to complicated: individual and family, self-employed, small business, nonresident (1040-NR), amended and prior-year returns, plus ITIN applications: '
       '<a class="lk" href="https://solvinglifellc.com">solvinglifellc.com</a>.</p><p>Studying for a career license? Try our exam apps for the Enrolled Agent, Series 65, SIE and Customs Broker exams.</p>'
       '<p><a class="btn btn-main" href="apps">See the study apps</a></p></div>')
def static(qs):
    o = ""
    for i, d in enumerate(qs, 1):
        opts = sorted([d["c"]] + d["w"], key=lambda t: h(d["q"] + t)); L = "ABCD"[opts.index(d["c"])]
        o += (f'<div class="pq"><p><b>{i}.</b> {E(d["q"])}</p><ol type="A">' + "".join(f"<li>{E(t)}</li>" for t in opts) +
              f'</ol><details><summary>Show answer</summary><p><b>{L}. {E(d["c"])}</b></p><p>{E(d["e"])}</p></details></div>\n')
    return o
def page(fn, title, desc, h1, intro, bank, n, shown, extra="", ns=0):
    url = SITE + fn
    o = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}"><meta property="og:url" content="{url}"><meta property="og:type" content="website">
<link rel="stylesheet" href="style.css">
<style>{CSS}
{PROMO_CSS}</style>
</head>
<body>
<header class="top"><div class="wrap"><a class="brand" href="./">Solving Life LLC</a><nav class="main" aria-label="Main"><a href="drivers-license-practice-test">Driver's test</a><a href="motorcycle-permit-practice-test">Motorcycle test</a><a href="citizenship-test">Citizenship test</a></nav></div></header>
<main class="page">
<h1>{E(h1)}</h1>
{intro}
<div class="tool"><div id="quiz"><button class="go" onclick="start()">Start a {n}-question practice test</button></div></div>
{extra}
{CTA}
<h2>Practice questions with answers</h2>
{static(shown)}
{PROMO}
<p>More free practice: <a href="drivers-license-practice-test">driver's license test, all states</a> · <a href="motorcycle-permit-practice-test">motorcycle permit test</a> · <a href="citizenship-test">U.S. citizenship test</a></p>
</main>
<footer class="bottom"><div class="wrap"><span>© 2026 Solving Life LLC. Practice questions are written by Solving Life LLC and are not official test questions. Not affiliated with any state DMV. Always study your state's official handbook.</span></div></footer>
<script>const B={json.dumps(bank, ensure_ascii=False).replace("</", "<\\/")},N={n},NS={ns};
{JS}</script>
</body></html>
"""
    open(f"pwa/company/{fn}.html", "w", encoding="utf-8").write(o)
urls = ["citizenship-test", "drivers-license-practice-test", "motorcycle-permit-practice-test"]
links = '<h2>Pick your state</h2><ul class="states">' + "".join(f'<li><a href="{slug(s)}">{E(s)}</a></li>' for s in STATES) + "</ul>"
page("drivers-license-practice-test", "Free Driver's License Practice Test 2026 (All 50 States): Permit Test Questions and Answers",
     "Free DMV permit practice test for every state: road signs, right-of-way, signals and safe driving questions with answers and explanations. No sign-in.",
     "Free driver's license practice test",
     "<p>Free practice for the written knowledge (permit) test. These questions cover the road signs, signals and rules of the road that are the same in every state. No sign-in.</p><p>Each state also sets its own speed limits, test length and some rules, so read your state's official driver handbook before test day.</p>",
     CAR, 25, CAR, links)
page("motorcycle-permit-practice-test", "Free Motorcycle Permit Practice Test 2026: Questions and Answers for Every State",
     "Free motorcycle permit practice test: braking, turning, lane position, gear, hazards and passenger questions with answers and explanations. No sign-in.",
     "Free motorcycle permit practice test",
     "<p>Free practice for the motorcycle written knowledge test. The questions follow the safe-riding rules taught in state motorcycle operator manuals across the country. No sign-in.</p><p>Helmet laws, permit rules and test length differ by state, so read your state's official motorcycle manual too.</p>",
     MOTO, 20, MOTO)
import os
for s in STATES:
    sf = "free/state/" + s.lower().replace(" ", "-") + ".txt"
    if os.path.exists(sf):
        src = open(sf, encoding="utf-8").readline().lstrip("#").strip()
        rows = [dict(zip("qcabxe", l.rstrip("\n").split("|"))) for l in open(sf, encoding="utf-8") if l.strip() and not l.startswith("#")]
        assert all(len(r) == 6 for r in rows), sf
        ST = norm(rows)
        page(slug(s), f"Free {s} Permit Practice Test 2026: {len(ST)} {s}-Specific Questions Plus Signs and Rules",
             f"Free {s} driver's permit practice test with {len(ST)} questions on {s}'s own laws (speed limits, teen rules, DUI limits) from the official handbook, plus road signs and rules. No sign-in.",
             f"Free {s} permit practice test",
             f"<p>Free practice for the {E(s)} written knowledge test: {len(ST)} questions on rules that {E(s)} sets itself, plus the road signs, signals and rules of the road used in every state. No sign-in.</p><p class=\"prog\">{E(s)} questions are based on the {E(src)}. Laws change, so check the current handbook before test day.</p>",
             ST + CAR, 25, ST, ns=len(ST), extra=f'<p>Riding a motorcycle in {E(s)}? Try the <a href="motorcycle-permit-practice-test">motorcycle permit practice test</a>.</p>')
        urls.append(slug(s)); print("state bank:", s, len(ST)); continue
    rot = sorted(CAR, key=lambda d: h(s + d["q"]))[:25]
    page(slug(s), f"Free {s} Permit Practice Test 2026: Driver's License Questions and Answers",
         f"Free {s} driver's permit practice test: road signs, right-of-way and safe driving questions with answers. No sign-in.",
         f"Free {s} permit practice test",
         f"<p>Free practice for the {E(s)} written knowledge test. These questions cover the road signs, signals and rules of the road that apply in {E(s)} and every other state.</p><p><b>Not included yet:</b> rules that only {E(s)} sets, such as its speed limits, fines, permit ages and the length of its test. Read the official {E(s)} driver handbook from the state's licensing agency before test day.</p>",
         CAR, 25, rot, f'<p>Riding a motorcycle in {E(s)}? Try the <a href="motorcycle-permit-practice-test">motorcycle permit practice test</a>.</p>')
    urls.append(slug(s))
open("free/urls.txt", "w").write("\n".join(urls) + "\n"); print(len(urls), "pages")
