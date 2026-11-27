"""Builds the free U.S. citizenship (naturalization civics) test page: pwa/company/citizenship-test.html.
Source: USCIS M-1778 (09/25) "128 Civics Questions and Answers (2025 version)" in free/civics.json (a U.S. government work).
free/es.txt is our own Spanish study translation (n|question|answers split by ;). Officeholder answers are set in NOW below:
check them against uscis.gov/citizenship/testupdates whenever an office changes hands, then rebuild."""
import json, html
from promo import PROMO, PROMO_CSS
E = html.escape
Q = json.load(open("free/civics.json"))
ES = {}
for l in open("free/es.txt", encoding="utf-8"):
    if l.strip():
        n, q, a = l.rstrip("\n").split("|"); ES[int(n)] = (q, a.split(";"))
CHECKED = "November 27, 2026"
NOW = {30: (["Mike Johnson", "Johnson"], "A new Speaker is expected to be chosen in January 2027. Check uscis.gov/citizenship/testupdates before your interview."),
       38: (["Donald J. Trump", "Donald Trump", "Trump"], ""), 39: (["JD Vance", "J.D. Vance", "Vance"], ""),
       57: (["John Roberts", "John G. Roberts, Jr.", "Roberts"], ""),
       23: (["It depends on your state. Find your two senators at senate.gov. (D.C. and the territories have no U.S. senators.)"], ""),
       29: (["It depends on where you live. Find your representative at house.gov by entering your ZIP code."], ""),
       61: (["It depends on your state. Check your state government's official website. (D.C. does not have a governor.)"], ""),
       62: (["Pick your state at the top of this page to see its capital."], "")}
CAP = {"Alabama":"Montgomery","Alaska":"Juneau","Arizona":"Phoenix","Arkansas":"Little Rock","California":"Sacramento","Colorado":"Denver","Connecticut":"Hartford","Delaware":"Dover","Florida":"Tallahassee","Georgia":"Atlanta","Hawaii":"Honolulu","Idaho":"Boise","Illinois":"Springfield","Indiana":"Indianapolis","Iowa":"Des Moines","Kansas":"Topeka","Kentucky":"Frankfort","Louisiana":"Baton Rouge","Maine":"Augusta","Maryland":"Annapolis","Massachusetts":"Boston","Michigan":"Lansing","Minnesota":"Saint Paul","Mississippi":"Jackson","Missouri":"Jefferson City","Montana":"Helena","Nebraska":"Lincoln","Nevada":"Carson City","New Hampshire":"Concord","New Jersey":"Trenton","New Mexico":"Santa Fe","New York":"Albany","North Carolina":"Raleigh","North Dakota":"Bismarck","Ohio":"Columbus","Oklahoma":"Oklahoma City","Oregon":"Salem","Pennsylvania":"Harrisburg","Rhode Island":"Providence","South Carolina":"Columbia","South Dakota":"Pierre","Tennessee":"Nashville","Texas":"Austin","Utah":"Salt Lake City","Vermont":"Montpelier","Virginia":"Richmond","Washington":"Olympia","West Virginia":"Charleston","Wisconsin":"Madison","Wyoming":"Cheyenne"}
assert len(CAP) == 50 and len(Q) == 128 and len(ES) == 128
D = []
for q in Q:
    a, note = NOW.get(q["n"], (q["a"], q["note"]))
    eq, ea = ES[q["n"]]
    if q["n"] not in NOW: assert len(ea) == len(a), (q["n"], len(ea), len(a))
    D.append(dict(n=q["n"], q=q["q"], a=a, s=1 if q["star"] else 0, g=q["sub"], t=note, eq=eq, ea=ea))
URL = "https://solvinglifewith.com/citizenship-test"
TITLE = "Free U.S. Citizenship Test Practice 2026: All 128 Civics Questions and Answers"
DESC = "Free practice for the 2025 version of the U.S. naturalization civics test: all 128 official USCIS questions and answers, a 20-question practice test, audio, and Spanish study help. No sign-in."
LD = json.dumps({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":d["q"],"acceptedAnswer":{"@type":"Answer","text":"; ".join(d["a"])}} for d in D[:40]]}).replace("</","<\\/")
static = ""; g = None
for d in D:
    if d["g"] != g:
        if g: static += "</ol>\n"
        g = d["g"]; static += f'<h3>{E(g)}</h3>\n<ol start="{d["n"]}">\n'
    static += f'<li><b>{E(d["q"])}</b>{" *" if d["s"] else ""}<br>{E(" · ".join(d["a"]))}{("<br><i>"+E(d["t"])+"</i>") if d["t"] else ""}</li>\n'
static += "</ol>\n"
CTA = ('<div class="cta"><h2>Need help with your U.S. tax return or an ITIN?</h2><p>USCIS can ask about your tax returns at the naturalization interview. '
       'Solving Life LLC prepares tax returns from simple to complicated: individual and family, self-employed and small business, nonresident (1040-NR), amended and prior-year returns, plus ITIN applications.</p>'
       '<p><a class="btn btn-main" href="https://solvinglifellc.com">Get tax help</a></p>'
       '<p>Studying for a career license too? Our exam apps cover the Enrolled Agent, Series 65, SIE, Customs Broker and EDPNA exams: <a style="color:#9FE1CB" href="apps">see the study apps</a>.</p></div>')
page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(TITLE)}</title>
<meta name="description" content="{E(DESC)}">
<link rel="canonical" href="{URL}">
<meta property="og:title" content="{E(TITLE)}"><meta property="og:description" content="{E(DESC)}"><meta property="og:url" content="{URL}"><meta property="og:type" content="website">
<link rel="stylesheet" href="style.css">
<style>
.cta{{background:#0F1B2D;color:#fff;border-radius:14px;padding:22px;margin:28px 0}}.cta p{{color:#DDE5F0}}.cta h2{{color:#fff;margin-top:0}}
.tool{{border:1px solid #D9E0EA;border-radius:14px;padding:18px;background:#fff;margin:18px 0}}
.row2{{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0}}.row2 select,.row2 button{{min-height:46px;font-size:16px;border-radius:10px;padding:10px 14px;border:1px solid #9AA8BC;background:#fff;color:#0F1B2D;cursor:pointer}}
.row2 button.main{{background:#0E7C66;color:#fff;border-color:#0E7C66;font-weight:600}}.row2 button.bad{{background:#B42318;color:#fff;border-color:#B42318}}
#card h2{{font-size:22px;margin:6px 0 10px}}#card .es{{color:#44546A;font-size:16px}}#card ul{{margin:8px 0 8px 20px}}.prog{{color:#44546A;font-size:14px}}
.page ol li{{margin:10px 0}}
{PROMO_CSS}
</style>
<script type="application/ld+json">{LD}</script>
</head>
<body>
<header class="top"><div class="wrap"><a class="brand" href="./">Solving Life LLC</a><nav class="main" aria-label="Main"><a href="./">Home</a><a href="drivers-license-practice-test">Driver's test</a><a href="free-practice-questions">License exams</a></nav></div></header>
<main class="page">
<h1>Free U.S. citizenship test practice</h1>
<p>All 128 official civics questions and answers for the <b>2025 version</b> of the naturalization test, from USCIS. Free, no sign-in.</p>
<ul>
<li><b>Filed Form N-400 on or after October 20, 2025:</b> you take this 2025 version. The officer asks up to 20 questions out loud. You need 12 correct.</li>
<li><b>Filed before October 20, 2025:</b> you take the older 2008 version (100 questions). Study that list at uscis.gov/citizenship.</li>
<li><b>Age 65 or older with 20 years as a permanent resident:</b> you study only the 20 questions marked with a star (*). You are asked 10 and need 6, and you may take the test in your own language.</li>
</ul>
<a href="https://study.solvinglifewith.com/citizenship/" style="display:block;text-decoration:none;margin:18px 0;padding:18px 20px;border-radius:16px;background:linear-gradient(135deg,#102A49,#158A7E);color:#fff;font-weight:800;font-size:19px;line-height:1.25;box-shadow:0 8px 22px rgba(16,42,73,.2)">Open the full free app →<span style="display:block;font-weight:500;font-size:15px;margin-top:4px;color:#DCEBF5">Flashcards, adaptive drills that repeat what you miss, and mock tests. Free.</span></a>
<div class="tool">
<div class="row2">
<select id="st" aria-label="Your state"><option value="">Your state (for the capital question)</option>{"".join(f"<option>{E(s)}</option>" for s in CAP)}<option>District of Columbia</option></select>
<select id="lang" aria-label="Study language"><option value="en">English only</option><option value="es">English + Español</option></select>
</div>
<div class="row2"><button class="main" onclick="start('test')">Practice test (20 questions)</button><button onclick="start('65')">65/20 test (10 questions)</button><button onclick="start('all')">Study all 128</button><button onclick="start('miss')" id="bmiss">Review my missed</button></div>
<div id="card" aria-live="polite"><p class="prog">The real test is spoken. Tap a button, say your answer out loud, then check it.</p></div>
</div>
<p class="prog">Names of officials checked {CHECKED}. They change after elections and appointments, so confirm at uscis.gov/citizenship/testupdates before your interview. You must give the name of the official serving on your interview day.</p>
{CTA}
<h2>All 128 questions and answers (2025 version)</h2>
<p>You only need to give one answer unless the question asks for more. Questions with * are the 65/20 questions.</p>
{static}
{PROMO}
<p>More free practice: <a href="drivers-license-practice-test">driver's license test</a> · <a href="motorcycle-permit-practice-test">motorcycle permit test</a> · <a href="free-practice-questions">license exam questions</a></p>
</main>
<footer class="bottom"><div class="wrap"><span>© 2026 Solving Life LLC. Questions and answers are from USCIS publication M-1778 (09/25). Spanish text is our own study translation. This site is not affiliated with USCIS and is not legal advice.</span></div></footer>
<script>
const D={json.dumps(D,ensure_ascii=False).replace("</","<\\/")},CAP={json.dumps(CAP)};
let S=null;const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}})[c]);
function ls(k,v){{try{{if(v===undefined)return JSON.parse(localStorage.getItem(k)||"null");localStorage.setItem(k,JSON.stringify(v))}}catch(e){{return null}}}}
let MISS=ls("civ-miss")||[];
function shuf(a){{a=a.slice();for(let i=a.length-1;i>0;i--){{const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}}return a}}
function start(m){{let pool=D;if(m==="65")pool=D.filter(d=>d.s);if(m==="miss")pool=D.filter(d=>MISS.includes(d.n));
  if(m==="miss"&&!pool.length){{$("card").innerHTML='<p>No missed questions yet. Take a practice test first.</p>';return}}
  const n=m==="test"?20:m==="65"?10:pool.length;S={{m,qs:(m==="all"?pool:shuf(pool)).slice(0,n),i:0,ok:0,bad:[],need:m==="test"?12:m==="65"?6:0}};show()}}
function ans(d){{if(d.n===62){{const s=$("st").value;if(s==="District of Columbia")return["D.C. is not a state and does not have a capital."];if(CAP[s])return[CAP[s]]}}return d.a}}
function show(){{const d=S.qs[S.i],es=$("lang").value==="es";
  $("card").innerHTML='<p class="prog">Question '+(S.i+1)+' of '+S.qs.length+(S.need?' · correct so far: '+S.ok:'')+'</p><h2>'+esc(d.q)+'</h2>'+(es?'<p class="es">'+esc(d.eq)+'</p>':'')+
  '<div class="row2"><button onclick="say()">🔊 Hear the question</button><button class="main" onclick="reveal()">Show answer</button></div><div id="a"></div>'}}
function say(){{try{{const u=new SpeechSynthesisUtterance(S.qs[S.i].q);u.lang="en-US";u.rate=.9;speechSynthesis.cancel();speechSynthesis.speak(u)}}catch(e){{}}}}
function reveal(){{const d=S.qs[S.i],es=$("lang").value==="es",a=ans(d);
  $("a").innerHTML='<ul>'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+(d.t?'<p class="prog">'+esc(d.t)+'</p>':'')+(es?'<ul class="es">'+d.ea.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+
  '<div class="row2"><button class="main" onclick="mark(1)">I got it right</button><button class="bad" onclick="mark(0)">I got it wrong</button></div>'}}
function mark(ok){{const d=S.qs[S.i];if(ok){{S.ok++;MISS=MISS.filter(n=>n!==d.n)}}else{{S.bad.push(d);if(!MISS.includes(d.n))MISS.push(d.n)}}ls("civ-miss",MISS);S.i++;
  if(S.i<S.qs.length)return show();
  const pass=S.need?S.ok>=S.need:null;
  $("card").innerHTML='<h2>'+(pass===null?'Done':pass?'You passed':'Not yet')+': '+S.ok+' of '+S.qs.length+' correct</h2>'+(S.need?'<p>You need '+S.need+' to pass.</p>':'')+
  (S.bad.length?'<p><b>Study these:</b></p><ul>'+S.bad.map(d=>'<li>'+esc(d.q)+'<br><i>'+esc(ans(d).slice(0,3).join(' · '))+'</i></li>').join('')+'</ul>':'<p>No misses. Well done.</p>')+
  '<div class="row2"><button class="main" onclick="start(\\''+S.m+'\\')">Try again</button></div>'}}
try{{$("st").value=ls("civ-st")||"";$("lang").value=ls("civ-lang")||"en"}}catch(e){{}}
$("st").onchange=()=>ls("civ-st",$("st").value);$("lang").onchange=()=>{{ls("civ-lang",$("lang").value);if(S&&S.i<S.qs.length)show()}};
</script>
</body></html>
"""
open("pwa/company/citizenship-test.html", "w", encoding="utf-8").write(page); print("citizenship-test.html", len(page))
