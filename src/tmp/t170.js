const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const errs=[];
for(const W of [390,1280]){const ctx=await b.newContext({viewport:{width:W,height:844},deviceScaleFactor:W<500?2:1});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(W+': '+e.message));
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2200);await p.evaluate(()=>{if(typeof OPEN!=="undefined")OPEN.moremodes=true;if(typeof render==="function")render()});
 if(W===390)console.log(await p.evaluate(()=>{const out=[];if(P10.length!==P10M.length)out.push('len '+P10.length+' vs '+P10M.length);
  P10M.forEach((M,i)=>{M.dp.forEach(d=>{if(d.a>=d.o.length)out.push(i+' dp')});M.m.forEach(r=>{if(r[0]>=P10[i].st.length)out.push(i+' step '+r[0])});
   M.fm.forEach(f=>{const L={};f.r.forEach(x=>L[x[0]]=x[2]);if(/1040(?!-X)/.test(f.f)){const v=k=>L[k]||0;
     if(L["11a"]!=null&&L["9"]!=null&&v("9")-v("10")!==v("11a"))out.push(i+' AGI');
     if(L["15"]!=null){const t=Math.max(0,v("11a")-v("12e")-v("13a")-v("13b")-v("12"));if(t!==v("15"))out.push(i+' TI '+t+' vs '+v("15"))}
     if(L["33"]!=null&&L["24"]!=null){const d=v("33")-v("24");if(d>0&&v("35a")!==d)out.push(i+' refund '+d);if(d<0&&v("37")!==-d)out.push(i+' owe '+(-d))}}})});return out.join(' | ')||'consistent'}));
 await p.click('[data-sec="bk"]');await p.click('[data-mode="taxsim"]');await p.waitForTimeout(100);
 if(W===390)await p.screenshot({path:'p10-list.png',fullPage:true});
 const n=await p.evaluate(()=>P10.length);
 for(let i=0;i<n;i++){await p.evaluate(i=>{tv.p10=i;tv.p10tab='intake';render()},i);
  for(const t of ['intake','docs','steps','ret','chk','key']){await p.click(`[data-p10tab="${t}"]`);await p.waitForTimeout(25);
   if(t==='steps'){await p.click('[data-p10dp="0|0"]');await p.click('[data-p10dp="1|1"]')}
   const wide=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(wide)errs.push(W+' overflow case '+(i+1)+' '+t)}
  // fill check with expected values
  await p.click('[data-p10tab="chk"]');
  await p.evaluate(i=>{P10M[i].fm.forEach((f,fi)=>f.r.forEach((x,ri)=>{const el=document.getElementById('p10c_'+fi+'_'+ri);if(el)el.value=x[2]<0?'-'+Math.abs(x[2]):String(x[2])}))},i);
  await p.click('[data-p10chk]');const r=await p.evaluate(i=>tv.p10res[i],i);if(r._ok!==r._n)errs.push('check '+i+' '+r._ok+'/'+r._n);
  if(W===390&&[0,10,11,15,16].includes(i)){await p.click('[data-p10tab="steps"]');await p.screenshot({path:`p10-steps-${i+1}.png`,fullPage:true});await p.click('[data-p10tab="ret"]');await p.screenshot({path:`p10-ret-${i+1}.png`,fullPage:true})}
 }
 // a wrong value
 await p.evaluate(()=>{tv.p10=8;tv.p10tab='chk';render()});await p.fill('#p10c_0_0','14500');await p.click('[data-p10chk]');console.log(W,'wrong:',await p.evaluate(()=>JSON.stringify(tv.p10res[8]._ok+'/'+tv.p10res[8]._n)));
 await ctx.close()}
console.log('errors',errs);await b.close()})();
