const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
await p.goto('http://localhost:8765/ea-exam-app/old164.html?study');await p.waitForTimeout(1200);
await p.evaluate(()=>{let seed=5;Math.random=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};const run=(mode,n)=>{try{startSession(mode,n)}catch(e){return}const s=sess;if(!s||view!=="session")return;let g=0;while(view==="session"&&sess===s&&g++<300){const cur=s.queue[s.pos];if(!cur){finish();break}s.cp=false;if(cur.learn){advance();continue}record(Math.random()<0.65,true);advance()}if(view==="session"&&sess===s)finish()};
  for(const pt of [1,2,3]){part=pt;filt="all";for(const m of ["easy","easy","quiz","qd","mix","hard","easy","quiz","missed","medium","qd","exam","quiz","hard"])run(m)}sess=null;view="home";persist()});
await p.goto('http://localhost:8765/ea-exam-app/?study');await p.waitForTimeout(1500);
const cdp=await ctx.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
console.log(JSON.stringify(await p.evaluate(()=>{const T=(f)=>{const a=performance.now();f();return Math.round(performance.now()-a)};const o={};part=1;view="home";
  o.render1=T(()=>render());o.render2=T(()=>render());
  xaDrop();o.xpState=T(()=>xpState());xaDrop();o.xaAll=T(()=>xaAll());o.xpNext=T(()=>xpNext());o.ready=T(()=>xaReadyHtml());o.quick=T(()=>xaQuickHtml());o.suggest=T(()=>xaSuggestHtml());o.xpHtml=T(()=>xpHtml());o.partStats=T(()=>partStats(1));o.plus=T(()=>plusStrip());
  o.cats=T(()=>xaCats());o.lessons=T(()=>xaLessons());o.unseen=T(()=>xaUnseen());o.miss=T(()=>missedPool(1,"all"));o.due=T(()=>dueList(1,"all"));
  // session answer cost
  startSession("qd",10);o.answer=T(()=>{record(true,true)});o.advance=T(()=>advance());o.answer2=T(()=>{record(false,true)});clearInterval(timerId);
  const s=sess;let g=0;while(view==="session"&&sess===s&&g++<30){const cur=s.queue[s.pos];if(!cur)break;s.cp=false;if(s.phase==="shown"){advance();continue}record(true,true);advance()}
  o.resultsView=view;o.results=T(()=>render());sess=null;view="home";o.homeAfter=T(()=>render());return o})));
await b.close()})();
