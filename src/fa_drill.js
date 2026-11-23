/* ===== Forms and acronyms drill, with a gauge (Version 199) =====
   Asked for: "also add forms and acronyms and similar drilling questions to test and gauge knowledge of all", after
   "i love how all forms and acronyms are integrated in ea app".
   What it is: one page per section that tests every form and every abbreviation the section uses, both ways
   (name to meaning, meaning to name), and shows how many are known.
   Where the items come from, so nothing has to be written twice:
   - forms: the section's own cards whose title is just a form or schedule name ("Form 8822", "Schedule 1-A");
   - abbreviations: the section's cards whose title is an abbreviation ("QCD"), plus every glossary abbreviation (gloss.js)
     that appears anywhere in the section's cards and questions.
   Any section gets the drill as soon as it has such cards or glossary entries, so Series 65 and EDPNA use the same code.
   It is kept apart from the question bank on purpose: these quick recognition questions do not enter Quick 10, mock exams
   or the readiness figure. Progress is saved in S.set.fa[key] = [times seen, times right, last answer right, day].
   "Known" means the last answer was right. */
let fa=null;const FAC={};
function faShort(b){let t=String(b||"").trim();const cut=t.search(/[.;:] /);if(cut>20&&cut<110)t=t.slice(0,cut);if(t.length>110)t=t.slice(0,107).replace(/\s+\S*$/,"")+"…";return t}
function faIsAcr(k){return /^[A-Z][A-Za-z0-9&\/-]{1,7}$/.test(k)&&(k.match(/[A-Z]/g)||[]).length>=2}
function faItems(pt){if(FAC[pt])return FAC[pt];const out=[],seen={};
  try{const all=BANK.filter(i=>i.p==pt),F=all.filter(i=>i.t==="f"),gp=(typeof GLP!=="undefined"&&GLP[pt])||{},off=(typeof GLOFF!=="undefined"&&GLOFF[pt])||{};
    const gl=k=>off[k]?null:(gp[k]||(typeof GL!=="undefined"?GL[k]:null)||null);
    F.forEach(i=>{const f=String(i.f||"").trim();
      if(/^(?:Form|Schedule|FinCEN Form) [A-Z0-9][A-Za-z0-9-]*(?: \(Form [0-9A-Z-]+\))?$/.test(f)){const m=faShort(i.b);if(m.length>=8)out.push({k:i.id,kind:"form",name:f,mean:m,full:String(i.b),d:i.d})}
      else if(faIsAcr(f)&&!seen[f]){let ex=String(i.b||"").split(":")[0].trim();const g=gl(f);
        if(!(ex.length>=4&&ex.length<=70&&ex[0].toUpperCase()===f[0].toUpperCase()&&/^[A-Za-z]/.test(ex)))ex=g&&g[0]?g[0]:"";
        if(ex&&ex.toLowerCase()!==f.toLowerCase()){seen[f]=1;out.push({k:i.id,kind:"acr",name:f,mean:ex,full:String(i.b),d:i.d})}}});
    const txt=all.map(i=>(i.f||"")+" "+(i.b||"")+" "+(i.s||"")+" "+(i.ex||"")+" "+(i.opts?i.opts.join(" "):"")).join(" \n ");
    const keys=new Set(Object.keys(typeof GL!=="undefined"?GL:{}));Object.keys(gp).forEach(k=>keys.add(k));
    keys.forEach(k=>{if(seen[k]||!faIsAcr(k))return;const g=gl(k);if(!g||!g[0]||g[0].length>70||g[0].toLowerCase()===k.toLowerCase())return;
      const re=new RegExp("(^|[^A-Za-z0-9])"+k.replace(/[\/\-&]/g,"\\$&")+"([^A-Za-z0-9]|$)");if(!re.test(txt))return;
      seen[k]=1;out.push({k:"gl:"+k,kind:"acr",name:k,mean:g[0],full:g[0]+(g[1]?". "+g[1]:"")})})}catch(e){}
  /* a kind needs at least 4 items to make a four-choice question */
  const n={form:out.filter(x=>x.kind==="form").length,acr:out.filter(x=>x.kind==="acr").length};
  return FAC[pt]=out.filter(x=>n[x.kind]>=4)}
function faRec(k){const m=(S.set&&S.set.fa)||{};return m[k]||null}
function faStat(pt){const L=faItems(pt),z=()=>({n:0,known:0,seen:0,miss:0}),o={all:z(),form:z(),acr:z()};
  L.forEach(x=>{const r=faRec(x.k);[o.all,o[x.kind]].forEach(t=>{t.n++;if(r){t.seen++;if(r[2])t.known++;else t.miss++}})});return o}
function faPct(t){return t.n?Math.round(100*t.known/t.n):0}
function faOthers(pool,it,field){const used={},out=[];used[String(it[field]).toLowerCase()]=1;
  const same=shuffle(pool.filter(x=>x!==it&&x.kind===it.kind&&x.d!==undefined&&x.d===it.d)),rest=shuffle(pool.filter(x=>x!==it&&x.kind===it.kind&&!(x.d!==undefined&&x.d===it.d)));
  for(const x of same.concat(rest)){const v=String(x[field]),lv=v.toLowerCase();if(used[lv])continue;used[lv]=1;out.push(v);if(out.length===3)break}return out}
function faMake(pool,it){let dir=Math.random()<0.5?0:1;
  if(it.kind==="form"){const num=it.name.replace(/^(?:FinCEN )?(?:Form|Schedule) /,"").replace(/ \(.*$/,"");if(it.mean.indexOf(num)>=0)dir=0}
  else if(it.mean.toUpperCase().indexOf(it.name.toUpperCase())>=0)dir=0;
  const field=dir===0?"mean":"name",wrong=faOthers(pool,it,field);if(wrong.length<3)return null;
  const q=it.kind==="form"?(dir===0?"What is "+it.name+"?":"Which form or schedule is this? “"+it.mean+"”"):(dir===0?"What does "+it.name+" stand for?":"Which abbreviation means “"+it.mean+"”?");
  const opts=shuffle([it[field]].concat(wrong));return{it,q,opts,a:opts.indexOf(it[field])}}
function faStart(kind){const pool=faItems(part),want=pool.filter(x=>kind==="all"||kind==="miss"||x.kind===kind),r=x=>faRec(x.k);
  const unseen=shuffle(want.filter(x=>!r(x))),miss=shuffle(want.filter(x=>r(x)&&!r(x)[2])),known=want.filter(x=>r(x)&&r(x)[2]).sort((a,b)=>(r(a)[3]||0)-(r(b)[3]||0)||(r(a)[0]-r(b)[0]));
  const order=kind==="miss"?miss:miss.slice(0,3).concat(unseen,miss.slice(3),known),Q=[];
  for(const it of order){const q=faMake(pool,it);if(q)Q.push(q);if(Q.length===10)break}
  if(!Q.length)return false;fa=Object.assign(fa||{},{scr:"q",kind,Q:shuffle(Q),i:0,ok:0,pick:-1});return true}
function faOpen(){fa={scr:"hub",back:view==="fa"&&fa?fa.back:view,by:window.scrollY};view="fa";render();window.scrollTo(0,0)}
function faNext(){if(!fa||fa.scr!=="q")return;clearTimeout(fa.timer);fa.i++;fa.pick=-1;if(fa.i>=fa.Q.length)fa.scr="end";render();window.scrollTo(0,0)}
function faAnswer(k){if(!fa||fa.scr!=="q"||fa.pick>=0)return;const q=fa.Q[fa.i],ok=k===q.a;fa.pick=k;if(ok)fa.ok++;
  S.set.fa=S.set.fa||{};const r=S.set.fa[q.it.k]||[0,0,0,0];S.set.fa[q.it.k]=[r[0]+1,r[1]+(ok?1:0),ok?1:0,today()];persist();render();
  /* same rhythm as Quick 10: a right answer moves on by itself after 2 seconds, a wrong one waits for Next */
  if(ok){const at=fa.i;fa.timer=setTimeout(()=>{if(view==="fa"&&fa&&fa.scr==="q"&&fa.i===at&&fa.pick>=0)faNext()},2000)}}
function faRender(){const V=document.getElementById("view");if(!V)return;if(!fa)fa={scr:"hub",back:"home"};const st=faStat(part),e=esc;
  const bar=t=>`<div class="fabar"><i style="width:${faPct(t)}%"></i></div>`;
  let h=`<section class="section faw"><div class="fatop"><button class="btn ghost small" data-fa="back">← Back</button><b>Forms and acronyms</b></div>`;
  if(!st.all.n){V.innerHTML=h+`<p class="small">This section has no form or abbreviation cards yet.</p></section>`;return}
  if(fa.scr==="hub"){const L=faItems(part),missed=L.filter(x=>{const r=faRec(x.k);return r&&!r[2]});
    h+=`<div class="card fag"><div class="fabig">${faPct(st.all)}%</div><div><b>${st.all.known} of ${st.all.n} known</b><div class="small">${st.all.seen} tried so far · ${st.all.miss} missed last time</div></div>${bar(st.all)}</div>
     <div class="fakinds">${st.form.n?`<div class="card"><b>Forms and schedules</b><div class="small">${st.form.known} of ${st.form.n} known</div>${bar(st.form)}</div>`:""}${st.acr.n?`<div class="card"><b>Abbreviations</b><div class="small">${st.acr.known} of ${st.acr.n} known</div>${bar(st.acr)}</div>`:""}</div>
     <button class="btn pri fago" data-fa="start" data-kind="all">Drill 10</button>
     <div class="fachips">${st.form.n?`<button class="btn" data-fa="start" data-kind="form">Forms only</button>`:""}${st.acr.n?`<button class="btn" data-fa="start" data-kind="acr">Abbreviations only</button>`:""}${missed.length?`<button class="btn" data-fa="start" data-kind="miss">Missed only (${missed.length})</button>`:""}</div>
     <p class="small">New ones come first, then the ones you missed. Each is asked both ways: name to meaning, and meaning to name. Known means your last answer was right. These quick questions do not change the readiness figure.</p>
     ${missed.length?`<details class="famiss"><summary>Read the ${missed.length} you missed</summary>${missed.slice(0,60).map(x=>`<div class="farow"><b>${e(x.name)}</b> ${e(x.full)}</div>`).join("")}</details>`:""}`}
  else if(fa.scr==="q"){const q=fa.Q[fa.i],done=fa.pick>=0,ok=fa.pick===q.a;
    h+=`<div class="small faprog">${fa.i+1} of ${fa.Q.length} · ${fa.ok} right</div><h1 class="faq nolink">${e(q.q)}</h1>
     <div class="opts">${q.opts.map((o,k)=>`<button class="opt${done?(k===q.a?" right":k===fa.pick?" wrong":""):""}" data-fa="pick" data-i="${k}" ${done?"disabled":""}><span class="k">${"ABCD"[k]}</span><span>${e(o)}</span></button>`).join("")}</div>
     ${done?`<div class="card fafb ${ok?"ok":"no"}"><b>${ok?"Right.":"Not this time."}</b> <span><b>${e(q.it.name)}</b>: ${e(q.it.full)}</span></div><button class="btn pri fago" data-fa="next">${fa.i+1>=fa.Q.length?"See the result":"Next"}</button>`:""}`}
  else{h+=`<div class="card fag"><div class="fabig">${fa.ok}/${fa.Q.length}</div><div><b>right in this round</b><div class="small">Known now: ${st.all.known} of ${st.all.n} (${faPct(st.all)}%)</div></div>${bar(st.all)}</div>
     <button class="btn pri fago" data-fa="start" data-kind="${e(fa.kind||"all")}">Another 10</button><div class="fachips"><button class="btn" data-fa="hub">Overview</button></div>
     ${fa.Q.filter((q,i)=>{const r=faRec(q.it.k);return r&&!r[2]}).map(q=>`<div class="farow"><b>${e(q.it.name)}</b> ${e(q.it.full)}</div>`).join("")}`}
  V.innerHTML=h+`</section>`}
function faClick(b){const a=b.dataset.fa;
  if(a==="open"){faOpen();return true}
  if(!fa)fa={scr:"hub",back:"home"};
  if(a==="back"){clearTimeout(fa.timer);if(fa.scr!=="hub"){fa.scr="hub";render();window.scrollTo(0,0);return true}const to=fa.back&&fa.back!=="fa"?fa.back:"home",y=fa.by||0;fa=null;view=to;render();window.scrollTo(0,y);return true}
  if(a==="hub"){clearTimeout(fa.timer);fa.scr="hub";render();window.scrollTo(0,0);return true}
  if(a==="start"){clearTimeout(fa.timer);if(faStart(b.dataset.kind||"all")){render();window.scrollTo(0,0)}return true}
  if(a==="pick"){faAnswer(+b.dataset.i);return true}
  if(a==="next"){faNext();return true}
  return true}
const faExtraView0=extraView;extraView=function(){if(view==="fa"){faRender();return true}return faExtraView0()};
const faExtraClick0=extraClick;extraClick=function(b){if(b.dataset.fa!==undefined)return faClick(b);return faExtraClick0(b)};
/* entry: a third button in the forms row under the main button (EA parts and the bookkeeping course); it shows the gauge.
   It shares the row instead of adding one, because tmp/t510.js keeps the page short and the path near the top. */
const faEntry0=fvEntryHtml;fvEntryHtml=function(){let h=faEntry0();try{const st=faStat(part);if(st.all.n>=8)h=h.replace('class="fventry"','class="fventry fa3"').replace(/<\/div>\s*$/,`<button class="btn fabtn" data-fa="open">🎯 Forms & acronyms drill ${faPct(st.all)}%</button></div>`)}catch(e){}return h};
/* Version 210: Series 65 (5) and EDPNA (6) have no IRS forms row, so they get a row with just the drill button under the main button. */
const faDoNext5=doNextHtml;doNextHtml=function(){const h=faDoNext5();try{if(h&&(part==5||part==6)){const st=faStat(part);if(st.all.n>=8)return h+`<div class="fventry"><button class="btn fabtn" data-fa="open">🎯 Forms & acronyms drill ${faPct(st.all)}%</button></div>`}}catch(e){}return h};
