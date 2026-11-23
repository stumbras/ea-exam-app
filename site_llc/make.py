# Builds the new solvinglifellc.com pages (static) into pwa/llc/. Run: python3 site_llc/make.py
# Content is written fresh from the facts on the current Wix site (services, prices, hours, contact).
# Links that need Wix features (booking, client portal, invoices, the inquiry form, blog) go to the
# live Wix site for now (WIX below); step 3 replaces them with direct Wix connections.
import os, html
OUT = os.path.join(os.path.dirname(__file__), "..", "pwa", "llc")
WIX = "https://www.solvinglifellc.com/"
BOOK = WIX            # TODO step 3: direct Wix Bookings link for the video meeting
PORTAL = WIX          # TODO step 3: client portal link
PAY = WIX             # TODO step 3: pay-an-invoice link
INQUIRY = WIX         # TODO step 3: inquiry form (Wix Forms) or own form posting to Wix
BLOG = "blog.html"    # posts copied from the Wix blog into post/<slug>.html (same addresses as on Wix)
PHONE = "(720) 432-0981"; TEL = "+17204320981"; EMAIL = "info@solvinglifellc.com"
HOURS = "Every day, 5:00 AM to 11:00 PM Mountain Time"

NAV = [("index.html", "Home"), ("services.html", "Services"), ("pricing.html", "Pricing"),
       ("about.html", "About"), ("faq.html", "FAQ"), ("blog.html", "Blog"), ("contact.html", "Contact")]

def page(fn, title, desc, body):
    nav = "".join(f'<a href="{h}"{" aria-current=\"page\"" if h == fn else ""}>{t}</a>' for h, t in NAV)
    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<base href="/">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="bar">Grand opening: ready to help now, ahead of the 2027 tax season · 🎉 <a href="https://solvinglifewith.com/giveaway" style="color:#fff">Free tax prep giveaway</a> · <a href="tel:{TEL}" style="color:#fff">{PHONE}</a></div>
<header class="top"><div class="wrap">
<a class="brand" href="index.html"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><rect x="1" y="1" width="34" height="34" rx="9" stroke="#0F1B2D" stroke-width="2"/><path d="M11 23c2 2 4 3 7 3 4 0 7-2 7-5 0-6-13-3-13-9 0-3 3-5 6-5 3 0 5 1 6 3" stroke="#0E7C66" stroke-width="2.4" stroke-linecap="round"/></svg>Solving Life LLC</a>
<nav class="main" aria-label="Main">{nav}</nav>
<a class="btn btn-main" href="{BOOK}">Book a video meeting</a>
</div></header>
<main>
{body}
</main>
<section class="contact"><div class="wrap">
<div class="col"><h2>Ready to get started?</h2><p>Send an inquiry or book a short video meeting. {HOURS}.</p>
<div class="row"><a class="btn btn-main" href="{INQUIRY}">Send an inquiry</a><a class="btn btn-line" href="{BOOK}">Book a video meeting</a></div></div>
<div class="col"><h3>Contact</h3><a class="big" href="mailto:{EMAIL}">{EMAIL}</a><a class="big" href="tel:{TEL}">{PHONE} · call or text</a><p>Online, all 50 states.</p></div>
</div></section>
<footer class="bottom"><div class="wrap" style="flex-direction:column;gap:18px">
<div style="display:flex;flex-wrap:wrap;gap:36px">
<nav aria-label="Services" style="display:flex;flex-direction:column;gap:8px"><b>Services</b>
<a href="services.html#individual">Individual &amp; family taxes</a><a href="services.html#business">Self-employed &amp; business</a><a href="services.html#itin">ITIN services</a><a href="services.html#international">International taxes</a><a href="services.html#gambling">Casino &amp; gambling taxes</a><a href="services.html#investments">Investments &amp; crypto</a><a href="services.html#irs">IRS help</a><a href="services.html#bookkeeping">Bookkeeping &amp; payroll</a><a href="services.html#apostille">Apostilles</a><a href="services.html#representation">IRS representation (March 2027)</a></nav>
<nav aria-label="Clients" style="display:flex;flex-direction:column;gap:8px"><b>Clients</b>
<a href="index.html#how">How it works</a><a href="pricing.html">Pricing</a><a href="faq.html#bring">What to bring</a><a href="faq.html">FAQ</a><a href="{PORTAL}">Client portal</a><a href="{PAY}">Pay an invoice</a><a href="{BLOG}">Blog</a></nav>
<nav aria-label="More" style="display:flex;flex-direction:column;gap:8px"><b>Solving Life</b>
<a href="https://study.solvinglifewith.com/ea/">Study apps</a><a href="https://solvinglifewith.com">Company site</a><a href="privacy.html">Privacy &amp; security</a><a href="terms.html">Terms</a><a href="disclaimer.html">Disclaimer</a><a href="accessibility.html">Accessibility</a></nav>
</div>
<span>© 2026 Solving Life LLC, a Colorado limited liability company. Not a law firm; not affiliated with the IRS. {HOURS}.</span>
</div></footer>
</body>
</html>
"""
    os.makedirs(os.path.dirname(os.path.join(OUT, fn)), exist_ok=True)
    open(os.path.join(OUT, fn), "w").write(doc)

SERVICES = [
 ("individual", "Individual & family taxes", "from $100", "Wage earners, families, retirees and students. Federal and state returns e-filed, credits checked, and a clear explanation of your result.", ["Forms W-2, 1099 and Social Security income", "Child and education credits", "Prior-year and missed returns, up to 3 years back"]),
 ("business", "Self-employed & small business", "from $150", "Gig workers, freelancers, sole proprietors and small LLCs and partnerships. We sort your income and expenses and file what your business needs.", ["Schedule C and self-employment tax", "Rideshare and delivery drivers", "Partnership returns for small LLCs"]),
 ("itin", "ITIN applications & renewals", "from $100", "Form W-7 for taxpayers, spouses and dependents who need an Individual Taxpayer Identification Number, usually filed together with the tax return.", ["New ITINs and renewals", "Spouses and dependents", "Document check by secure video"]),
 ("international", "International taxes", "expat $200 with FBAR · nonresident from $150", "U.S. citizens and green card holders living abroad, and visitors, students and workers who file as nonresidents.", ["Expat returns with the FBAR included", "Nonresident returns (Form 1040-NR)", "Free online treaty check for foreign visitors facing 30% withholding"]),
 ("gambling", "Casino & gambling taxes", "quote on request", "Big wins, professional players and foreign visitors with U.S. winnings. We report wins and losses correctly under the newest rules.", ["Forms W-2G and 1042-S", "Records of losses and sessions", "Refunds of withholding for eligible visitors"]),
 ("investments", "Investments, day trading & crypto", "from $50 plus add-ons", "Stocks, funds, options and crypto, from a few trades to active trading.", ["Stocks, ETFs and funds +$50; crypto +$50", "Day traders from $250", "Trader tax status review $150"]),
 ("irs", "IRS help", "from $75", "Letters, notices and fixes for returns already filed.", ["Letter or CP2000 review $75", "Payment plan set-up $75", "Amended return $75"]),
 ("bookkeeping", "Bookkeeping & payroll", "from $150 a month", "Monthly books in QuickBooks Online, payroll, and catch-up work so your records are ready at tax time.", ["Monthly bookkeeping from $150/month; with payroll from $250/month", "Catch-up and clean-up $40/hour; QuickBooks set-up $150", "Form 1099-NEC filing $15 per contractor"]),
 ("apostille", "Apostilles & document help", "quote on request", "Need a U.S. document accepted abroad? We help you get apostilles for birth and marriage certificates, diplomas, powers of attorney and business papers, and track them until they are done.", ["Colorado and other state documents", "Federal (U.S. Department of State) documents", "Help for families, students and businesses abroad"]),
 ("representation", "IRS representation & audit protection", "coming March 2027", "Audit support and representation before the IRS will open in March 2027. Join the waitlist and we will contact you first.", ["Audit and exam support", "Collection and payment cases", "Audit protection plans"]),
]

def svc_cards(limit=None):
    out = []
    for k, t, p, d, _ in SERVICES[:limit]:
        out.append(f'<a class="card" href="services.html#{k}"><div class="top"><h3>{html.escape(t)}</h3></div><p>{html.escape(d)}</p><span class="price">{html.escape(p)}</span></a>')
    return "".join(out)

page("index.html", "Solving Life LLC — taxes, ITINs and bookkeeping, done right",
 "Online tax preparation, ITIN applications and bookkeeping for families, the self-employed, investors, immigrants, expats and nonresidents in all 50 states.",
 f"""<section class="hero"><div class="wrap">
<p class="kicker">Now open · online · all 50 states and abroad</p>
<h1>Taxes, ITINs, bookkeeping and apostilles, done right.</h1>
<p class="lead">Personal, online help for families, the self-employed, small businesses, investors, immigrants, expats and nonresidents. Upload securely, meet by video, sign electronically.</p>
<div class="row"><a class="btn btn-main" href="pricing.html">See services &amp; prices</a><a class="btn btn-line" href="{INQUIRY}">Send an inquiry</a></div>
</div></section>
<section class="block"><div class="wrap">
<div class="head"><h2>What we do</h2><p>Clear starting prices. The final quote is confirmed before any work begins.</p></div>
<div class="grid">{svc_cards()}</div>
</div></section>
<section class="block alt" id="how"><div class="wrap">
<div class="head"><h2>How it works</h2><p>Everything happens online. We meet in person only for ITIN document checks and special cases.</p></div>
<div class="steps">
<div class="step"><h3>Send an inquiry</h3><p>Tell us what you need. We reply with the documents to gather and a quote.</p></div>
<div class="step"><h3>Upload securely</h3><p>Send your documents through the encrypted client portal, never by plain email.</p></div>
<div class="step"><h3>Review and follow up</h3><p>We prepare your return and go over it with you by video or message.</p></div>
<div class="step"><h3>E-sign, then e-file</h3><p>You approve and sign electronically, and we file federal and state returns.</p></div>
</div></div></section>
<section class="block"><div class="wrap">
<div class="head"><h2>Why clients choose us</h2></div>
<div class="grid">
<div class="card"><h3>ITINs with the tax return</h3><p>We prepare your Form W-7 together with the return and review your documents with you by secure video.</p></div>
<div class="card"><h3>Casino and gambling know-how</h3><p>Wins, losses and withholding refunds on Forms W-2G and 1042-S, reported under the newest rules.</p></div>
<div class="card"><h3>Visitors and nonresidents</h3><p>A free online treaty check for foreign visitors whose U.S. winnings or income were withheld at 30%.</p></div>
</div></div></section><section class="block alt"><div class="wrap">
<div class="head"><h2>Tax tips that are actually fun</h2><p>A new 30-second video every day: tax myths, quizzes, an anime series and infomercial parodies that teach real rules.</p></div>
<div class="grid">
<a class="card" href="https://www.youtube.com/@solvinglifellc"><h3>YouTube</h3><p>Shorts every day at 6 PM Mountain, plus step-by-step guides.</p><span class="price">Subscribe</span></a>
<a class="card" href="https://www.tiktok.com/@solvinglifellc"><h3>TikTok</h3><p>Quick tax rules, quizzes and the Tax Season anime.</p><span class="price">Follow</span></a>
<a class="card" href="https://www.instagram.com/solvinglifellc/"><h3>Instagram</h3><p>Reels, giveaways and reminders before every deadline.</p><span class="price">Follow</span></a>
<a class="card" href="https://www.facebook.com/1389976747538284"><h3>Facebook</h3><p>Reels and news for families and small businesses.</p><span class="price">Follow</span></a>
</div></div></section>
<section class="block"><div class="wrap">
<div class="head"><h2>Become a tax pro with our study apps</h2><p>The same team that does the work built the apps. Study on your phone, free to start.</p></div>
<div class="grid">
<a class="card" href="https://study.solvinglifewith.com/ea/"><h3>Enrolled Agent Prep</h3><p>All 3 EA exam parts with adaptive drills, mock exams, audio and a full bookkeeping &amp; QuickBooks course.</p><span class="price">Try it free</span></a>
<a class="card" href="https://study.solvinglifewith.com/65/"><h3>Series 65 Prep</h3><p>A guided path in the exam's own order, a forms &amp; acronyms drill and quick quizzes.</p><span class="price">Try it free</span></a>
<a class="card" href="https://study.solvinglifewith.com/cble/"><h3>Customs Broker Prep</h3><p>Real past CBP exam questions (April and October 2026) with the official answers and the 19 CFR or HTSUS citation for each.</p><span class="price">Try it free</span></a>
<a class="card" href="https://study.solvinglifewith.com/kids/"><h3>Becoming Genius (kids)</h3><p>Quiz shows, coding missions and lessons with levels and rewards. No ads.</p><span class="price">Free</span></a>
</div></div></section>""")

page("services.html", "Services — Solving Life LLC", "Tax returns, ITINs, international and gambling taxes, investments and crypto, IRS help and bookkeeping.",
 '<section class="block"><div class="wrap"><div class="head"><h1 style="margin:0;font-size:clamp(32px,5vw,48px)">Services</h1><p>Starting prices; the final quote is confirmed before work begins.</p></div>' +
 "".join(f'<article class="card" id="{k}" style="margin-bottom:18px"><div class="top"><h2 style="margin:0;font-size:24px">{html.escape(t)}</h2><span class="price">{html.escape(p)}</span></div><p>{html.escape(d)}</p><ul class="list">' + "".join(f"<li>{html.escape(x)}</li>" for x in L) + f'</ul><div class="row" style="margin-top:8px"><a class="btn btn-main" href="{INQUIRY}">{"Join the waitlist" if k=="representation" else "Ask about this"}</a></div></article>' for k, t, p, d, L in SERVICES) +
 "</div></section>")

rows = [("Individual & family taxes", "from $100"), ("Self-employed & business", "from $150"), ("ITIN services", "from $100"), ("Expat taxes (FBAR included)", "$200"), ("Nonresident returns (1040-NR)", "from $150"), ("Casino & gambling", "quote on request"), ("Stocks, ETFs and funds", "+$50"), ("Crypto", "+$50"), ("Day trader", "from $250"), ("Trader tax status review", "$150"), ("Letter or CP2000 review", "$75"), ("Payment plan", "$75"), ("Amended return", "$75"), ("Monthly bookkeeping", "from $150/month"), ("Bookkeeping + payroll", "from $250/month"), ("Catch-up and clean-up", "$40/hour"), ("QuickBooks set-up", "$150"), ("Form 1099-NEC filing", "$15 per contractor"), ("Apostille help", "quote on request")]
page("pricing.html", "Pricing — Solving Life LLC", "Starting prices for tax returns, ITINs, investments, IRS help and bookkeeping.",
 '<section class="block"><div class="wrap"><div class="head"><h1 style="margin:0;font-size:clamp(32px,5vw,48px)">Pricing</h1><p>Starting points. Your final quote is confirmed before any work begins.</p></div><div class="tw"><table class="prices"><thead><tr><th>Service</th><th>Price</th></tr></thead><tbody>' +
 "".join(f"<tr><td>{html.escape(a)}</td><td><b>{html.escape(b)}</b></td></tr>" for a, b in rows) + "</tbody></table></div></div></section>")

page("about.html", "About — Solving Life LLC", "Solving Life LLC is a Colorado company offering online tax preparation, ITIN help and bookkeeping.",
 """<section class="block"><div class="wrap about"><div class="text">
<h1 style="margin:0;font-size:clamp(32px,5vw,48px)">About Solving Life LLC</h1>
<p>Solving Life LLC is a Colorado limited liability company. We prepare tax returns, ITIN applications and books for clients across the United States, online first, with personal video meetings when they help.</p>
<p>We focus on the returns that worry people most: ITINs, nonresidents and expats, gambling winnings, investments and crypto, and the self-employed. We would rather take fewer clients and do each return right than compete on the cheapest price.</p>
<p>Every client gets a clear quote before we start, secure document upload, and an explanation of the result in plain words.</p>
</div><div class="box"><h3>Credentials</h3><p>PTIN holder · QuickBooks ProAdvisor</p></div></div></section>""")

faqs = [("When can I file?", "The IRS usually opens e-filing in late January. You can send your documents earlier, and we file as soon as the IRS accepts returns."),
 ("Do I have to mail my passport for an ITIN?", "Ask us about your situation before you mail anything. We review your documents with you by secure video and tell you the safest way to submit them."),
 ("Is everything online?", "Yes. You upload documents to the encrypted client portal, meet by video if you like, and sign electronically. In-person visits are only for ITIN document checks and special cases."),
 ("Can you represent me before the IRS now?", "We help with IRS letters, notices and payment plans today. Full representation and audit protection open in March 2027; join the waitlist to be first."),
 ("Do I have to report crypto?", "Simply holding crypto is usually not taxable, but sales, swaps, staking and rewards must be reported. We sort your transactions and report them correctly."),
 ("My books are behind. Can you help?", "Yes. Catch-up and clean-up work is billed at $40 an hour, and we can keep your books current every month after that."),
 ("What should I bring?", "Photo ID; Social Security numbers or ITINs for everyone on the return; all income forms (W-2, 1099, W-2G, 1042-S); records of expenses, deductions and estimated payments; last year's return; and bank details for your refund.")]
page("faq.html", "FAQ — Solving Life LLC", "Answers about filing dates, ITINs, online service, IRS help, crypto and bookkeeping.",
 '<section class="block"><div class="wrap" style="max-width:820px"><h1 style="margin:0 0 20px;font-size:clamp(32px,5vw,48px)">Frequently asked questions</h1>' +
 "".join(f'<details{" id=\"bring\"" if q.startswith("What should") else ""}><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>' for q, a in faqs) + "</div></section>")

page("contact.html", "Contact — Solving Life LLC", "Email, phone and hours for Solving Life LLC.",
 f"""<section class="block"><div class="wrap" style="max-width:820px"><h1 style="margin:0 0 12px;font-size:clamp(32px,5vw,48px)">Contact</h1>
<p style="font-size:18px">The fastest way to start is an inquiry or a short video meeting. You can also call, text or email.</p>
<div class="grid"><div class="card"><h3>Email</h3><p><a href="mailto:{EMAIL}">{EMAIL}</a></p></div><div class="card"><h3>Call or text</h3><p><a href="tel:{TEL}">{PHONE}</a></p></div><div class="card"><h3>Hours</h3><p>{HOURS}</p></div></div>
</div></section>""")

def legal(fn, title, paras):
    page(fn, f"{title} — Solving Life LLC", title, f'<section class="block"><div class="wrap" style="max-width:820px"><h1 style="margin:0 0 6px;font-size:clamp(30px,4vw,42px)">{title}</h1><p class="muted">Last updated November 23, 2026</p>' + "".join(f"<h2>{html.escape(h)}</h2><p>{html.escape(t)}</p>" for h, t in paras) + "</div></section>")

legal("privacy.html", "Privacy & security", [
 ("What we collect", "The information you give us to prepare returns and keep books: names, identification numbers, income records, and bank details for refunds or payments."),
 ("How we use it", "Only to provide the services you asked for and to meet legal requirements. We never sell it. Federal law forbids us to use or disclose tax return information for other purposes without your signed written consent."),
 ("Work outside the United States", "Some preparation work may be done by a team member outside the United States. We ask for your written consent before any of your information is used that way."),
 ("Keeping it safe", "Documents travel through an encrypted client portal, business accounts use two-factor sign-in, and access to client files is limited to the people who need them."),
 ("Your choices", f"You may ask what information we hold, ask us to correct it, or ask us to delete what we are not required to keep. Write to {EMAIL}.")])
legal("terms.html", "Terms", [
 ("Engagement", "Each client signs a written engagement agreement before work begins. It sets out the services, the price and both sides' responsibilities, and it controls if it differs from this page."),
 ("Your information", "You are responsible for giving us complete and accurate information. We rely on it and may ask for documents that support it."),
 ("Prices", "Prices on this site are starting points. Your final quote is confirmed before we start."),
 ("Contact", f"{EMAIL} · {PHONE}")])
legal("disclaimer.html", "Disclaimer", [
 ("General information", "Articles and pages on this site are general information, not tax or legal advice for your situation. Tax law changes; contact us before you act on anything here."),
 ("Not a law firm", "Solving Life LLC is not a law firm and is not affiliated with the IRS or any government agency.")])
legal("accessibility.html", "Accessibility", [
 ("Our aim", "We want everyone to be able to use this site. Pages use readable type, strong contrast, real buttons and links, and work on phones and with screen readers."),
 ("Need help?", f"If anything on the site is hard to use, call or text {PHONE} or write to {EMAIL} and we will help you directly.")])
print("pages:", sorted(os.listdir(OUT)))

# ---- Blog: the posts from the Wix blog, at the same /post/<slug> addresses ----
from blog_posts import POSTS, SOURCES_NOTE
from datetime import date
E = html.escape
def nice(d): return date.fromisoformat(d).strftime("%B %-d, %Y")
def block(b):
    k, v = b
    if k == "p": return f"<p>{E(v)}</p>"
    if k == "h2": return f"<h2>{E(v)}</h2>"
    if k in ("ul", "ol"): return f"<{k}>" + "".join(f"<li>{E(i)}</li>" for i in v) + f"</{k}>"
    if k == "table":
        head = "".join(f"<th>{E(c)}</th>" for c in v[0])
        rows = "".join("<tr>" + "".join(f"<td>{E(c)}</td>" for c in r) + "</tr>" for r in v[1:])
        return f'<div class="tbl"><table><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div>'
    if k == "sources": return "<h2>Sources</h2><ul class=\"src\">" + "".join(f"<li>{E(i)}</li>" for i in v) + f"</ul><p class=\"note\">{E(SOURCES_NOTE)}</p>"
    raise ValueError(k)
for i, po in enumerate(POSTS):
    body = "".join(block(b) for b in po["blocks"]).replace("send an inquiry.", f'<a href="{INQUIRY}">send an inquiry</a>.')
    more = "".join(f'<li><a href="post/{q["slug"]}">{E(q["title"])}</a></li>' for q in POSTS if q is not po)[:]
    page(f"post/{po['slug']}.html", po["title"] + " — Solving Life LLC", po["excerpt"],
f"""<article class="post wrap"><p class="meta"><a href="blog.html">Blog</a> · {nice(po["date"])} · {po["minutes"]} min read</p>
<h1>{E(po["title"])}</h1>{body}
<aside class="more"><h2>More from the blog</h2><ul>{more}</ul></aside></article>""")
cards = "".join(f'<a class="card post-card" href="post/{q["slug"]}"><span class="meta">{nice(q["date"])} · {q["minutes"]} min</span><h3>{E(q["title"])}</h3><p>{E(q["excerpt"])}</p></a>' for q in POSTS)
page("blog.html", "Blog — Solving Life LLC", "Plain-English tax guides: ITINs, expats and the FBAR, students, nonresident casino winnings and missed refunds.",
f"""<section class="hero"><div class="wrap"><h1>Blog</h1><p class="lead">Short, plain-English guides to the tax questions our clients ask most.</p></div></section>
<section><div class="wrap"><div class="grid">{cards}</div></div></section>""")
