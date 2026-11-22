const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await (await b.newContext({viewport:{width:430,height:932}})).newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);
 console.log(await p.evaluate(()=>{const ids=BANK.map(i=>i.id);const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);const o={};for(const i of BANK){const k='P'+i.p+(i.t==='f'?' facts':' questions');o[k]=(o[k]||0)+1}const lv={};for(const i of BANK.filter(x=>x.t==='q')){const k='P'+i.p+' lv'+i.lv;lv[k]=(lv[k]||0)+1}
   const badOpt=BANK.filter(i=>i.t==='q'&&(new Set(i.opts).size!==i.opts.length||i.opts.length<4)).map(i=>i.id);const badDom=BANK.filter(i=>!PARTS[i.p].doms[i.d]).map(i=>i.id);
   const longest=BANK.filter(i=>i.t==='q').map(i=>Math.max(...i.opts.map(o=>o.length))).sort((a,b)=>b-a)[0];
   return JSON.stringify({total:BANK.length,calcTypes:GENS.length,dupIds:dup,badOpt,badDom,counts:o,lv,longestOption:longest})}));
 // each part: start Easy and several modes, make sure every item renders and can be answered
 for(const part of [1,2,3]){const r=await p.evaluate(async(pt)=>{part=pt;render();const out={};for(const m of ['easy','medium','hard','weak']){startSession(m);if(!sess){out[m]='no session';continue}let n=0,bad=0;for(const cur of sess.queue){if(cur.learn)continue;const it=BYID[cur.id];try{const V=view4(cur,it);if(V.kind==='mcq'&&(V.opts.length<2||V.ans==null))bad++;n++}catch(e){bad++}}out[m]=n+' items'+(bad?' BAD '+bad:'');sess=null;view='home'}return out},part);console.log('Part',part,JSON.stringify(r))}
 // render every new question once in a session view to catch layout or script errors
 const r2=await p.evaluate(()=>{let n=0,fail=0;const qs=BANK.filter(i=>i.t==='q'&&i.lv===1);for(const it of qs){try{sess={mode:'medium',queue:[mkEntry(it)],pos:0,done:0,correct:0,missed:[],answers:{},flags:{},start:Date.now(),limit:0,qstart:Date.now(),phase:'ask',sel:null,requeued:{},total:1,newIds:[],p0:partStats(it.p)};part=it.p;view='session';render();if(!document.querySelector('[data-opt]'))fail++;n++}catch(e){fail++}}sess=null;view='home';part=1;render();return n+' easy questions rendered, failures '+fail});console.log(r2);
 console.log('overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'errors',errs.slice(0,3));await b.close()})();
