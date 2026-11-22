/* ================= Calmer kids home: big hub tiles + one-button Daily Genius with performance ================= */
const KHUBS=[
 {k:"city",ic:"🌴",n:"Brick Bay City",sub:"Walk into buildings: chess, poker, mahjong, arcade, game show, hacker HQ, airport, bank vault",g:"linear-gradient(135deg,#f97316,#db2777 55%,#7c3aed)",keys:["city"]},
 {k:"pschool",ic:"✈️",n:"Pilot School",sub:"Planes, jets, helicopters, rockets",g:"linear-gradient(135deg,#0ea5e9,#1d4ed8 60%,#1e1b4b)",keys:["pschool"]},
 {k:"learnhub",ic:"🎓",n:"Learning Center",sub:"Career Labs, Genius Hospital, Computer Academy, Quiz Show",g:"linear-gradient(135deg,#22c55e,#0f766e)",keys:["music","learn","term","mine","jobs"]},
 {k:"gameroom",ic:"🎮",n:"Game Room",sub:"Chess, Robot Chess, poker, mahjong, Mars Colony",g:"linear-gradient(135deg,#a855f7,#4338ca)",keys:["chess","poker","mj","col"]},
 {k:"prog",ic:"📈",n:"My Progress",sub:"Prize goal, quests, skills, badges",g:"linear-gradient(135deg,#334155,#0f172a)",keys:[]}];
function kHubNeg(H){try{return H.keys.some(id=>kNeglected(id))}catch(_){return false}}
function kHubTiles(){const k=KS(),gi=kGoalInfo(),q=kQuests(),qd=q.ids.filter(id=>q.cl[id]).length;
  const info={city:k.city?`💵 $${k.city.money||0} · 💎 ${(k.city.gems||[]).length}/10`:"NEW buildings!",pschool:k.fly?`🏆 ${k.fly.pts||0} pts · ✅ ${Object.keys(k.fly.done||{}).length}/${KFLYM.length}`:"Take off!",
   learnhub:`🎤 Quiz Show · next: ${KDEST[Math.min(k.rocket.dest,KDEST.length-1)][1]}`,gameroom:`♞ Lv ${k.chess.lv} · 🤖 Lv ${(k.cbot||{}).lv||1} · 🃏 Lv ${k.poker.lv}`,prog:`🎁 ${Math.round(gi.f*100)}% · 📜 ${qd}/${q.ids.length} quests`};
  return `<div class="khubs">${KHUBS.map((H,i)=>{const neg=!KNEGPLAY.includes(H.k)&&kHubNeg(H);return `<button class="khub${i<2||i===4?" big":""}${neg?" neg":""}" data-k="${H.k}" style="--hg:${H.g}"><span class="khubic">${H.ic}</span><span class="khubt"><b>${H.n}</b><span>${H.sub}</span><em>${info[H.k]}</em></span>${neg?`<span class="khubneg">🔴 +🎟️</span>`:""}</button>`}).join("")}</div>`}
function kGenToday(){const g=kGenDay(),r=kRot();return{c:g.cur?1:0,r:g.cre?1:0,t:g.tea?1:0,q:r.done["q:genius"]?1:0}}
function kGenStreak(){const k=KS(),d=k.genDays||{};let n=0;for(let i=0;i<400;i++){if(d[kToday(-i)])n++;else if(i>0)break}return n}
function kGenAcc(){const h=KS().hero||{};let n=0,c=0;for(const id in h){n+=h[id].n||0;c+=h[id].c||0}return{n,c,p:n?Math.round(c/n*100):null}}
function kGeniusBtn(){const k=KS(),T=kGenToday(),done=T.c+T.r+T.t+T.q;if(done===4){k.genDays=k.genDays||{};if(!k.genDays[kToday()]){k.genDays[kToday()]=1;persist()}}
  const A=kGenAcc(),st=kGenStreak();
  return `<button class="kgenbtn${done===4?" all":""}" data-k="genius"><span class="kgbic">🧠</span><span class="kgbt"><b>Daily Genius</b><span>${done===4?"✅ All done today!":`${done} of 4 done today`}${A.p!=null?` · 🎯 ${A.p}% right`:""}${st?` · 🔥 ${st} day${st>1?"s":""}`:""}</span><span class="kgbdots">${[["🤔",T.c],["🎨",T.r],["🧩",T.t],["🧠",T.q]].map(([e,x])=>`<i class="${x?"on":""}">${x?"✓":e}</i>`).join("")}</span></span><span class="kgbgo">▶</span></button>`}
function kGeniusStats(){const k=KS(),h=k.hero||{},A=kGenAcc(),st=kGenStreak(),g=kGenDay();
  const rows=KHERO.map(H=>{const x=h[H[0]]||{n:0,c:0};return{H,n:x.n||0,c:x.c||0,p:x.n?Math.round(x.c/x.n*100):null,lv:Math.floor((x.c||0)/5)+1}}).sort((a,b)=>(a.p??-1)-(b.p??-1));
  return `<div class="kcard"><div class="kh">📊 Your Genius performance</div>
   <div class="kgstat"><div><b>${A.p!=null?A.p+"%":"–"}</b><span>right in Genius Quiz</span></div><div><b>${A.c}</b><span>right answers</span></div><div><b>${st}</b><span>day streak</span></div></div>
   <div class="ksmall" style="margin:6px 0">🤔 ${g.curN} curious · 🎨 ${g.creN} creative · 🧩 ${g.teaN} teasers so far</div>
   ${rows.map(r=>`<div class="kgrow"><span>${r.H[1]}</span><b>${esc(r.H[2])}</b><i class="kbar sm"><u style="width:${r.p||0}%;background:${r.p==null?"#64748b":r.p>=80?"#22c55e":r.p>=60?"#eab308":"#ef4444"}"></u></i><em>${r.p==null?"new":r.p+"%"} · Lv ${r.lv}</em></div>`).join("")}
   <div class="ksmall" style="margin-top:6px">Red topics come up more often in the Genius Quiz until they turn green.</div></div>`}
