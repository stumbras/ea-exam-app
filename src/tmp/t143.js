const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);
 console.log(await p.evaluate(()=>[5,6].map(q=>{const it=BANK.filter(i=>i.p==q);const ids=new Set(it.map(i=>i.id));const doms={};it.forEach(i=>doms[i.d]=(doms[i.d]||0)+1);
   const badOpts=it.filter(i=>i.t==="q"&&(new Set(i.opts).size<4||i.opts.some(o=>!o)));return {items:it.length,unique:ids.size,byDomain:JSON.stringify(doms),badOpts:badOpts.length,lv:JSON.stringify(it.filter(i=>i.t==="q").reduce((a,i)=>(a[i.lv]=(a[i.lv]||0)+1,a),{}))}})));
 await b.close()})();
