const {chromium}=require('playwright');const fs=require('fs');
const html=fs.readFileSync('/home/claude/ea-app/tmp/web/index.html','utf8').replace(/<link[^>]*fonts[^>]*>/g,'');
const page=html;
const mock=`(()=>{const store=JSON.parse(sessionStorage.getItem('__db')||'{}');const save=()=>sessionStorage.setItem('__db',JSON.stringify(store));
const doc=p=>({id:p.split('/').pop(),path:p,async get(){const d=store[p];return{exists:!!d,data(){return d?JSON.parse(JSON.stringify(d)):undefined}}},async set(d){store[p]=JSON.parse(JSON.stringify(d));save()},async delete(){delete store[p];save()}});
const col=p=>({path:p,doc:id=>doc(p+'/'+id)});
window.claude={use:async n=>n==='db'?{doc(p){if(p.split('/').length%2)throw new TypeError('odd');return doc(p)},collection(p){if(p.split('/').length%2===0)throw new TypeError('even');return col(p)}}:n==='user'?{id:async()=>'u_test'}:null}})();`;
(async()=>{const b=await chromium.launch();
 for(const withDb of [false,true]){const ctx=await b.newContext({viewport:{width:430,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  if(withDb)await p.addInitScript(mock);
  await p.route('https://ea.test/**',r=>r.fulfill({contentType:'text/html',body:page}));await p.goto('https://ea.test/app');await p.waitForTimeout(1500);
  console.log(withDb?'WITH':'WITHOUT','|',await p.evaluate(()=>document.querySelector('#view .ledger').innerText.replace(/\n+/g,' / ')));
  await p.evaluate(()=>{for(let k=0;k<12;k++){const it=BANK[k];grade(it,2);logDomain(it,true)}persist();render()});await p.waitForTimeout(2500);await p.evaluate(()=>render());
  console.log('  after 12 answers |',await p.evaluate(()=>document.querySelector('#view .ledger').innerText.replace(/\n+/g,' / ')));
  if(withDb){await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(1500);console.log('  new device |',await p.evaluate(()=>Object.keys(S.it).length+' items | '+document.querySelector('#view .ledger').innerText.replace(/\n+/g,' / ')))}
  await p.screenshot({path:'/home/claude/ea-app/tmp/banner-'+(withDb?'on':'off')+'.png'});console.log('  errors',errs);await ctx.close()}
 await b.close()})();
