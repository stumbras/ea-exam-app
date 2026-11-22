const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];const p=await b.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errs.push(e.message));
 const msg=()=>p.evaluate(()=>{const n=[...document.querySelectorAll('#view .notice b')].map(x=>x.textContent);return n.join(' || ').slice(0,260)});
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);await p.click('[data-sec="bk"]');
 // QBO: try it yourself
 await p.click('[data-mode="qbo"]');await p.click('[data-qtry]');await p.waitForTimeout(100);await p.screenshot({path:'i-qbo-try.png',fullPage:true});
 await p.click('[data-qform="Bank deposit"]');await p.waitForTimeout(80);
 console.log('fields',await p.evaluate(()=>[...document.querySelectorAll('#view select,#view input')].map(x=>x.id+':'+(x.options?[...x.options].length:x.value)).join(' ')));
 await p.selectOption('#qwho','Owner');await p.selectOption('#qcat','Services');await p.fill('#qamt','4000');await p.click('[data-qsave]');await p.waitForTimeout(100);
 console.log('wrong:',await msg());await p.screenshot({path:'i-qbo-wrong.png',fullPage:true});
 await p.evaluate(()=>{const q=QS();q.tx.pop();persist();render()});
 await p.click('[data-qtab="new"]');await p.click('[data-qform="Bank deposit"]');await p.selectOption('#qwho','Owner');await p.selectOption('#qcat',"Owner's Investment");await p.fill('#qamt','4000');await p.click('[data-qsave]');await p.waitForTimeout(100);
 console.log('right:',await msg(),'|',await p.evaluate(()=>document.querySelector('.qeq').innerText.replace(/\n/g,' ')+' | '+document.querySelector('.sesshead').innerText.replace(/\n/g,' ')));
 await p.screenshot({path:'i-qbo-right.png',fullPage:true});
 await p.click('[data-qexit]');
 // Tax: manual with interview and tap-fill
 await p.click('[data-mode="taxsim"]');await p.click('[data-tcl="rowan"]');await p.click('[data-ttab="office"]');for(let i=0;i<2;i++)await p.click('[data-tof]:not([disabled])');console.log('portal locked before return:',await p.$eval('[data-tof="portal"]',b=>b.disabled));
 await p.click('[data-ttab="interview"]');for(let i=0;i<4;i++){await p.click('[data-tiv]');await p.waitForTimeout(40)}await p.screenshot({path:'i-tax-iv.png',fullPage:true});await p.click('[data-tiv="notes"]');
 await p.click('[data-ttab="personal"]');await p.selectOption('#tstatus','Single');await p.click('[data-tsave="personal"]');await p.click('[data-ttab="office"]');for(let i=0;i<2;i++)await p.click('[data-tof]:not([disabled])');
 await p.click('[data-ttab="income"]');await p.click('[data-tadd="w2"]');await p.waitForTimeout(80);
 for(const t of await p.$$('[data-ttap]'))await t.click();await p.screenshot({path:'i-tax-tap.png',fullPage:true});
 console.log('tapped:',await p.evaluate(()=>['twe','twn','tw1','tw2','tw4','tw6'].map(i=>document.getElementById(i).value).join(' | ')));
 await p.fill('#tw2','400');await p.click('[data-tsave="w2"]');await p.waitForTimeout(80);console.log('w2 wrong:',await msg());
 await p.click('[data-tdel="w2:0"]');await p.click('[data-tadd="w2"]');for(const t of await p.$$('[data-ttap]'))await t.click();await p.click('[data-tsave="w2"]');await p.waitForTimeout(80);console.log('w2 right:',await msg());
 await p.click('[data-tadd="int"]');await p.fill('#tip','Plain Bank');await p.fill('#ti1','250');await p.click('[data-tsave="int"]');
 await p.click('[data-ttab="state"]');await p.click('[data-tsave="state"]');await p.click('[data-ttab="payments"]');await p.selectOption('#trm','Direct deposit');await p.fill('#trt2','102000021');await p.fill('#tac','1234567890');await p.fill('#tac2','1234567890');await p.click('[data-tsave="refm"]');console.log('refund:',await msg());await p.click('[data-ttab="summary"]');await p.click('[data-ttab="review"]');await p.click('[data-tsave="done"]');await p.click('[data-ttab="office"]');await p.click('[data-tof="inv"]');
 await p.click('[data-ttab="efile"]');await p.check('#tsign');for(const x of await p.$$('.tero'))await x.check();await p.selectOption('#tpm',{index:1});await p.click('[data-tsave="send"]');await p.click('[data-tolt="ef"]');await p.click('[data-tefx="tx"]');await p.click('[data-tefx="st"]');console.log('ack:',await p.evaluate(()=>TR(tv.cur).ack));await p.click('[data-ttab="office"]');await p.click('[data-tof="saved"]');await p.waitForTimeout(80);
 console.log('manual finish:',await p.evaluate(()=>[TR("rowan").ack,TR("rowan").help||0,document.querySelector('#view .notice').innerText.slice(0,90),TR("rowan").notes.slice(0,60)]));
 // reviewer drill on each client
 await p.click('[data-tcl=""]');console.log('mgr:',await p.evaluate(()=>document.querySelector('.vscr .sr').innerText.replace(/\n/g,' ')));
 for(const id of ['rowan','maya','reyes','nina','haddad']){await p.click(`[data-tcl="${id}"]`);await p.click('[data-tdrill]');await p.waitForTimeout(80);
  const n=await p.evaluate(()=>{const m=document.querySelector('#view').innerText.match(/(\d+) key lines? still/);return m?m[1]:'?'});if(id==='maya')await p.screenshot({path:'i-tax-drill.png',fullPage:true});
  await p.click('[data-thint]');console.log(id,'drill lines',n,'| diag',await p.evaluate(()=>tdiag(TC.find(c=>c.id===tv.cur),TR(tv.cur)).length),'| wide',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));await p.click('[data-tcl=""]')}
 // solo mode
 await p.click('[data-tcl="maya"]');await p.click('[data-ttab="guide"]');console.log('solo:',await p.evaluate(()=>[tv.solo,!!document.querySelector('.coach')]));
 console.log('errors',errs);await b.close()})();
