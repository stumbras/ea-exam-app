const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844},hasTouch:true})).newPage();
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="T";k.sound=false;k.autoRead=false;k.adultUntil=Date.now()+9e5;k.warm={day:kToday(),start:Date.now(),sec:400,n:12,done:1,les:1,last:[]};k.lastSeen=Date.now();persist()});
let bad=[],tot=0;
for(const L of["bone","musc","org","sys"])for(const V of["F","B"]){
  const ids=await p.evaluate(([L,V])=>{KV={scr:"body",lay:L,vw:V,mode:"home",sel:null};render();return kBodyParts(L,V).filter(x=>x!=="skin")},[L,V]);
  for(const id of ids){await p.evaluate(()=>{KV.sel=null;KV.mode="home";render()});
    const pts=await p.evaluate(id=>{const g=document.querySelector(`g[data-kbp="${id}"]`);g.scrollIntoView({block:"center"});return [...g.children].slice(0,1).map(c=>{let pt;try{const L=c.getTotalLength(),q=c.getPointAtLength(L*0.3);pt=new DOMPoint(q.x,q.y).matrixTransform(c.getScreenCTM())}catch(_){}const r=c.getBoundingClientRect();if(c.tagName!=="path"||!/stroke-width/.test(c.outerHTML)||c.getAttribute("fill")!=="none"&&!c.classList.contains("bl")&&!c.classList.contains("tn"))pt={x:r.x+r.width/2,y:r.y+r.height/2};return[pt.x,pt.y,r.width,r.height]})},id);
    tot++;await p.mouse.click(pts[0][0],pts[0][1]);await p.waitForTimeout(40);const sel=await p.evaluate(()=>KV.sel);if(sel!==id)bad.push(`${L}/${V} ${id}→${sel} (${Math.round(pts[0][2])}x${Math.round(pts[0][3])})`)}}
console.log('parts',tot,'mismatch',bad.length);console.log(bad.join('\n'));await b.close()})();
