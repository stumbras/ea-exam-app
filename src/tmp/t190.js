// duplicate-stem and near-duplicate check for one part
const {chromium}=require('playwright');const P=+process.argv[2]||2;
(async()=>{const b=await chromium.launch();const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
console.log(await p.evaluate(P=>{const q=BANK.filter(i=>i.p==P&&i.t==="q"),m={},out=[];const norm=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ").trim();
 q.forEach(i=>{const k=norm(i.s);(m[k]=m[k]||[]).push(i.id)});for(const k in m)if(m[k].length>1)out.push('DUP '+m[k].join(',')+' '+k.slice(0,80));
 const ids={};BANK.forEach(i=>{ids[i.id]=(ids[i.id]||0)+1});for(const k in ids)if(ids[k]>1)out.push('DUPID '+k);
 return `part ${P}: ${q.length} questions\n`+out.join('\n')},P));await b.close()})();
