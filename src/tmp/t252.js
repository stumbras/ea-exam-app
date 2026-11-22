const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.stack.slice(0,250)));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";view="kids";KV={scr:"home"};render()});
await p.click('[data-k="term"]');await p.waitForTimeout(300);await p.click('[data-kos="termux"]');await p.waitForTimeout(300);
const run=async c=>{await p.fill('#tin',c);await p.click('#tgo');await p.waitForTimeout(150);await p.evaluate(()=>document.querySelectorAll('.thack,.tlight').forEach(x=>x.remove()))};
for(const c of ["pkg update","pkg install cowsay","cowsay Hello","pwd","termux-setup-storage","ls storage/shared","ifconfig","ping 192.168.1.50","pkg install openssh","ssh kid@192.168.1.50","ls","uptime","exit","ssh-keygen","ssh-copy-id kid@192.168.1.50"])await run(c);
await p.screenshot({path:'k26termux.png'});console.log('lvx',await p.evaluate(()=>[S.kids.term.lvx,Object.keys(S.kids.hack||{}).length]));
console.log('errors',JSON.stringify(errs));await b.close()})();
