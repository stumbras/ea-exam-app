const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";k.tix=2;view="kids";KV={scr:"home"};render()});
await p.click('[data-k="term"]');await p.waitForTimeout(400);await p.click('[data-kos="tesla"]');await p.waitForTimeout(400);await p.screenshot({path:'k14term.png',fullPage:true});
const run=async c=>{await p.fill('#tin',c);await p.click('#tgo');await p.waitForTimeout(250)};
await run('cs tesla');console.log('nudge1',await p.evaluate(()=>KV.T.nudge.replace(/<[^>]+>/g,'')));
await p.click('[data-tfix]');await p.click('#tgo');await p.waitForTimeout(500);await p.screenshot({path:'k14granted.png'});
await p.waitForTimeout(3600);
const cmds=['ls','cat dashboard.txt','ls -a','cat .easter_eggs','echo sound=goat > horn.cfg','cat horn.cfg','wc -l autopilot/cameras.txt','grep person autopilot/detect.log','grep cone autopilot/detect.log | wc -l','cp firmware.txt firmware.bak','echo plaid=on >> mode.cfg','tail -n 3 logs/trip.log','find . -name *.key','ls -l lights'];
for(const c of cmds){await run(c);await p.evaluate(()=>document.querySelectorAll('.thack').forEach(x=>x.remove()))}
await run('./lights/show.sh');console.log('denied',await p.evaluate(()=>KV.T.lines.slice(-3).map(l=>l.h.replace(/<[^>]+>/g,'')).join(' | ')));
await run('chmod +x lights/show.sh');await run('./lights/show.sh');await p.waitForTimeout(400);await p.screenshot({path:'k14show.png'});await p.evaluate(()=>document.querySelectorAll('.thack,.tlight').forEach(x=>x.remove()));
await run('grep car autopilot/detect.log');console.log('elite nudge',await p.evaluate(()=>KV.T.nudge.replace(/<[^>]+>/g,'')));
await run('grep car autopilot/detect.log | sort');await run('grep person autopilot/detect.log > report.txt');await run('echo echo hi > hello.sh');console.log('step',await p.evaluate(()=>KV.T.nudge.replace(/<[^>]+>/g,'')));await run('bash hello.sh');
await p.evaluate(()=>document.querySelectorAll('.thack,.tlight').forEach(x=>x.remove()));
console.log('lvt',await p.evaluate(()=>[S.kids.term.lvt,Object.keys(S.kids.hack||{}).length,S.kids.coins]));
await p.evaluate(()=>{KV={scr:"home"};render()});await p.click('[data-k="term"]');await p.waitForTimeout(300);await p.click('[data-kos="linux"]');await p.waitForTimeout(300);await p.click('[data-k="tbyte"]');await p.waitForTimeout(200);await p.screenshot({path:'k14help.png',fullPage:true});await p.click('[data-k="tauto"]');await p.waitForTimeout(800);console.log('auto',await p.evaluate(()=>[$('#tin').value,KV.T.hinted]));
console.log('errors',JSON.stringify(errs));await b.close()})();
