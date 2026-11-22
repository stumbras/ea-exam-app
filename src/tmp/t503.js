const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const out={};const q=BANK.filter(i=>i.t==="q");
 out.yr24=q.filter(i=>/\b2024\b/.test(i.s)&&!/2025|2026/.test(i.s)).map(i=>i.p+' | '+i.s.slice(0,150)+' => '+i.opts[i.ans]);
 const st={};out.dup=[];q.forEach(i=>{const k=i.p+i.s.toLowerCase().replace(/[^a-z0-9]/g,"");if(st[k])out.dup.push(i.p+' | '+i.s.slice(0,120)+' || A1: '+st[k].opts[st[k].ans]+' || A2: '+i.opts[i.ans]+' ids '+st[k].id+','+i.id);st[k]=i});
 // answer-length bias: share of questions where the correct option is the single longest (chance = 25%)
 out.bias={};Object.keys(PARTS).forEach(pt=>{const qq=q.filter(i=>i.p==pt&&i.opts.length===4);let L=0,S2=0;qq.forEach(i=>{const l=i.opts.map(x=>String(x).length),m=Math.max(...l),mn=Math.min(...l);if(l[i.ans]===m&&l.filter(x=>x===m).length===1)L++;if(l[i.ans]===mn&&l.filter(x=>x===mn).length===1)S2++});out.bias[pt]=Math.round(L/qq.length*100)+'% longest, '+Math.round(S2/qq.length*100)+'% shortest of '+qq.length});
 // lessons per domain
 out.units={};Object.keys(PARTS).forEach(pt=>{const D=PARTS[pt].doms;out.units[pt]=Object.keys(D).map(d=>d+':'+((UNITS[pt]||[]).filter(u=>u.d==d).length)+'u/'+BANK.filter(i=>i.p==pt&&i.d==d&&i.t==="f").length+'f/'+BANK.filter(i=>i.p==pt&&i.d==d&&i.t==="q").length+'q').join('  ')});
 out.units_fields=Object.keys((UNITS[1]||[])[0]||{});out.lkey=LKEY;out.size=Math.round((localStorage.getItem(LKEY)||"").length/1024)+'KB';
 out.modes=[...new Set([...document.querySelectorAll('[data-mode]')].map(x=>x.dataset.mode))];return out});
console.log(JSON.stringify(r,null,1).slice(0,5200));await b.close()})();
