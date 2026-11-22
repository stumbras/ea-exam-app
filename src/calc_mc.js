/* ================= Calculations the way the exam asks them: pick 1 of 4, with teaching =================
   The SEE has no typed answers: every question, calculations too, is multiple choice with 4 options.
   Wrong choices are built from the usual mistakes: an in-between number from the working (stopping a step
   early) and near misses. A learner can open a worked example with other numbers, reveal the steps one at
   a time, or say "I don't know, teach me" and get the full working plus a fresh one of the same kind. */
function calcKind(key){return /%$/.test(key)?"%":/^\$/.test(key)?"$":"n"}
function calcDp(key){const m=String(key).replace("%","").split(".");return m[1]?m[1].length:0}
function calcFmt(key,v){const k=calcKind(key),dp=calcDp(key);
  if(k==="%")return v.toFixed(dp)+"%";
  if(k==="$")return "$"+v.toLocaleString("en-US",{minimumFractionDigits:dp,maximumFractionDigits:dp});
  return dp?v.toFixed(dp):String(Math.round(v))}
function calcNums(text,kind){const out=[];const re=/(-?)(\$?)(\d[\d,]*(?:\.\d+)?)(%?)/g;let m;
  while((m=re.exec(text))){const v=parseFloat(m[3].replace(/,/g,""))*(m[1]?-1:1);if(!isFinite(v))continue;
    const k=m[4]?"%":m[2]?"$":"n";if(k===kind)out.push(v)}return out}
function calcMC(c){if(c.opts)return c;const a=c.ans,key=c.key,kind=calcKind(key),dp=calcDp(key);
  const unit=dp?Math.pow(10,-dp):1,gap=Math.max(c.tol||0,Math.abs(a)*0.02,unit*0.99);
  const opts=[key],why=[""],seen=new Set([key]);
  const add=(v,w)=>{if(opts.length>=4||!isFinite(v))return;if(a>0&&v<0)return;const s=calcFmt(key,v);if(seen.has(s)||Math.abs(v-a)<gap)return;seen.add(s);opts.push(s);why.push(w)};
  if(kind==="n"&&!dp&&Number.isInteger(a)&&Math.abs(a)<=20)for(const d of shuffle([1,-1,2,-2,3])){if(a+d>=0)add(a+d,"Count again, item by item, against the rule in the first step.")}
  const lines=String(c.steps||"").split("\n").filter(x=>x&&!x.startsWith("Watch out:"));
  const given=new Set(calcNums(c.stem||"",kind).map(v=>calcFmt(key,v)));
  // 1) numbers from the working that are not the final answer: the "stopped one step early" mistake
  const mids=[];lines.forEach((ln,k)=>calcNums(ln,kind).forEach(v=>{const s=calcFmt(key,v);
    if(given.has(s)||mids.some(x=>x[1]===s))return;const r=a?Math.abs(v/a):1;if(a&&(r<0.15||r>8))return;mids.push([v,s,k+1])}));
  shuffle(mids).slice(0,2).forEach(([v,,k])=>add(v,`That amount appears in step ${k} of the working. It's an in-between number, not the final answer the question asks for.`));
  // 2) near misses, the way a slip with a rate or a limit looks
  const mult=shuffle([0.85,1.15,0.9,1.1,0.8,1.2,0.75,1.25,0.5,2]);
  for(const m of mult){if(opts.length>=4)break;let v=a*m;if(!dp&&Math.abs(v)>=1000)v=Math.round(v/10)*10;add(v,"Close, but not right. Go back through each step and check the rate, limit or base amount used.")}
  // 3) answer is zero, or still short of choices: use the given numbers, then simple steps away
  if(opts.length<4)calcNums(c.stem||"",kind).forEach(v=>add(v,"That's one of the numbers given in the question, not the result."));
  for(let k=1;opts.length<4&&k<40;k++)add(a+(a?Math.abs(a)*0.07*k:unit*k*(kind==="$"?500:5)),"Not right. Work the steps again.");
  c.opts=opts;c.why=why;return c}
function calcLines(c){return String(c.steps||"").split("\n").filter(x=>x&&!x.startsWith("Watch out:"))}
function calcTeachHook(){const s=sess;if(!s||view!=="session")return;const cur=s.queue[s.pos];if(!cur||!cur.calc)return;
  const it=BYID[cur.id],card=document.querySelector("#view .card");if(!card||!it)return;const e=esc;
  const r=S.it&&S.it[it.id],isNew=!r||r[4]===0;
  if(s.phase==="ask"){
    if(!cur.exm){const x=calcMC(it.make());cur.exm=x.key===cur.calc.key?calcMC(it.make()):x}
    if(cur.exOpen===undefined)cur.exOpen=isNew||!!cur.like;
    const L=calcLines(cur.calc),h=cur.hint||0,shown=L.slice(0,Math.min(h,L.length-1));
    const box=document.createElement("div");box.className="calcteach";
    box.innerHTML=`<div class="small muted" style="margin:4px 0 6px">Method: <b>${e(it.name||it.s)}</b>. On the exam this is 1 of 4 choices, like here.</div>
      ${cur.exOpen?`<div class="related" style="margin:6px 0"><b>📖 Worked example, other numbers</b><div class="small" style="margin:4px 0">${e(cur.exm.stem)}</div>${stepsHtml(cur.exm.steps)}<div class="small"><b>Answer: ${e(cur.exm.key)}</b>. Same method for the question above, new numbers.</div></div>`
        :`<button class="btn ghost small" data-calc="ex">📖 Show a worked example first</button>`}
      ${shown.length?`<div class="related" style="margin:6px 0"><b>💡 Steps so far</b><ol class="steps">${shown.map(x=>`<li>${e(x)}</li>`).join("")}</ol>${h>=L.length-1?`<div class="small">Now do the last step yourself and pick the answer.</div>`:""}</div>`:""}
      <div class="row" style="margin:6px 0">${h<L.length-1?`<button class="btn small" data-calc="hint">💡 ${h?"Next step":"Show the first step"}</button>`:""}<button class="btn ghost small" data-calc="teach">🤷 I don't know, teach me</button></div>
      ${h?`<div class="small muted">With steps shown, a right answer counts as practice, not mastered.</div>`:""}`;
    const o=card.querySelector(".opts");if(o)o.parentNode.insertBefore(box,o);else card.appendChild(box)}
  else if(s.phase==="shown"){const ex=card.querySelector(".explain");if(!ex)return;
    const ok=s.lastOk,pick=s.sel,w=!ok&&pick!=null&&pick>0&&cur.calc.why?cur.calc.why[pick]:"";
    const top=document.createElement("div");top.innerHTML=`<div style="margin:6px 0"><b>${ok?"Right":"The answer"}: ${e(cur.calc.key)}</b>${!ok&&pick!=null&&pick>=0&&cur.calc.opts[pick]?` · you picked ${e(cur.calc.opts[pick])}`:""}</div>${w?`<div class="small" style="margin-bottom:6px">${e(w)}</div>`:""}<div class="small muted">How to work it:</div>`;
    ex.insertBefore(top,ex.children[1]||null);
    if(!ok&&!cur.likeQueued&&!QUICK.includes(s.mode)&&s.mode!=="mock"){cur.likeQueued=1;s.queue.splice(Math.min(s.queue.length,s.pos+2),0,Object.assign(mkEntry(it),{like:1}));s.total++}
    const row=card.querySelector("#next");if(row&&!cur.like2){const b=document.createElement("button");b.className="btn small";b.dataset.calc="like";b.textContent="🔁 Try one like it now";row.parentNode.insertBefore(b,row.nextSibling)}}}
function calcTeachClick(b){const d=b.dataset;if(view!=="session"||!sess)return false;const s=sess,cur=s.queue[s.pos];if(!cur||!cur.calc)return false;
  if(d.calc==="ex"){cur.exOpen=true;render();return true}
  if(d.calc==="hint"){cur.hint=(cur.hint||0)+1;cur.hinted=1;render();return true}
  if(d.calc==="teach"){cur.hinted=1;s.sel=-1;record(false,false);if(!cur.likeQueued){cur.likeQueued=1;s.queue.splice(s.pos+1,0,Object.assign(mkEntry(BYID[cur.id]),{like:1}));s.total++}return true}
  if(d.calc==="like"){cur.like2=1;s.queue.splice(s.pos+1,0,Object.assign(mkEntry(BYID[cur.id]),{like:1}));s.total++;advance();return true}
  if(d.conf!==undefined&&cur.hinted&&s.phase==="ask"){submitAnswer(false);return true}
  return false}
