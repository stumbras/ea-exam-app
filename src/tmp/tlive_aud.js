const {chromium,devices}=require('playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({...devices['iPhone 13']});const p=await c.newPage();
await p.goto('https://study.solvinglifewith.com/ea/',{waitUntil:'networkidle'});await p.waitForTimeout(3000);
const r=await p.evaluate(()=>{const o={};try{o.hosted=HOSTED;o.recOn=recOn();o.recKeys=Object.keys(REC).length;o.say=sayable('Single/HOH: $79,000–$89,000. MFJ: IRA, SSA');o.ver=typeof APPV!=='undefined'?APPV:null;}catch(e){o.err=String(e)}return o});
console.log(JSON.stringify(r));
const html=await p.content();console.log((html.match(/Version \d+/)||[])[0]);await b.close()})();
