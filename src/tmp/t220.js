const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
await p.evaluate(()=>{delete S.kids;const k=KS();k.setup=true;k.name="Alex";view="kids";KV={scr:"home"};render()});await p.click('[data-k="term"]');
const run=async c=>{await p.fill('#tin',c);await p.press('#tin','Enter');await p.waitForTimeout(40)};
await p.click('[data-kos="win"]');
for(const c of ["Get-Location","Get-ChildItem","cd station","Get-Content log.txt","cd ..","New-Item -ItemType Directory rockets","New-Item rockets\\plan.txt",'echo "launch at noon" > rockets\\plan.txt',"Select-String diamond cave\\map.txt","Copy-Item station\\crew.txt station\\crew_backup.txt","Rename-Item notes.txt ideas.txt","Remove-Item junk.txt","Get-Content station\\crew.txt | Sort-Object","ipconfig","Get-Process","explorer .","mkdir base",'echo hello > base\\hello.txt']) await run(c);
console.log('win',await p.evaluate(()=>[S.kids.term.lvw,KTWIN.length,S.kids.term.cwd]));await p.screenshot({path:'k7win.png'});
await p.click('[data-kos="mac"]');
for(const c of ["pwd","ls","cd station","cat log.txt","cd ~","mkdir rockets","touch rockets/plan.txt","echo launch at noon > rockets/plan.txt","open .","say hello space academy","ls -a station","grep diamond cave/map.txt","cp station/crew.txt station/crew_backup.txt","mv notes.txt ideas.txt","rm junk.txt","cat station/crew.txt | sort","mkdir base","echo hello > base/hello.txt"]) await run(c);
console.log('mac',await p.evaluate(()=>[S.kids.term.lvm,KTMAC.length]));await p.screenshot({path:'k7mac.png'});
await p.click('[data-kos="linux"]');console.log('linux back',await p.evaluate(()=>[S.kids.term.os,S.kids.term.lv,!!S.kids.term.fs]));
await p.click('[data-k="desk"]');for(const os of ["win","mac","mint"]){await p.click(`[data-kdos="${os}"]`);for(let i=0;i<KDLEN(os);i++){}}
function KDLEN(){return 0}
for(const os of ["win","mac","mint"]){await p.click(`[data-kdos="${os}"]`);const n=await p.evaluate(o=>KDESK[o].length,os);for(let i=0;i<n;i++){const combo=await p.evaluate(o=>KDESK[o][kDeskLv(o)][2],os);
  if(i===2&&os==="win"){await p.click('[data-kkey="ctrl"]');await p.click('[data-kkey="x"]').catch(async()=>{await p.click('[data-kkey="ctrl"]')})}
  const mods=await p.evaluate(o=>KMODS[o],os);for(const key of combo.filter(x=>mods.includes(x)))await p.click(`[data-kkey="${key}"]`);for(const key of combo.filter(x=>!mods.includes(x)))await p.click(`[data-kkey="${key}"]`);
  if(i===6)await p.screenshot({path:`k7desk_${os}.png`});await p.waitForTimeout(1700)}}
console.log('desk',await p.evaluate(()=>[kDeskLv("win"),kDeskLv("mac"),kDeskLv("mint"),kCompPower().got,kCompPower().max,kCRank(kCompPower().got)]));
console.log('troph',await p.evaluate(()=>Object.keys(S.kids.troph||{}).join(",")));
console.log('errors',JSON.stringify(errs));await b.close()})();
