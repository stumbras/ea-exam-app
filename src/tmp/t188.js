const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>{const ks=Object.keys(BAL1),out=[];let miss=[];const stop=ks.indexOf('p1qlwcpq2');
 ks.forEach((k,n)=>{const i=BANK.find(x=>x.id===k);if(!i){miss.push(k);return}if(n<stop)out.push(k+' | '+i.s+'\n  => '+i.opts.join(' || ')+(i.bal?'':' [NOT APPLIED]'))});
 return 'missing: '+miss.join(',')+'\n'+out.join('\n')}));await b.close()})();
