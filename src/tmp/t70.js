const {chromium}=require('playwright');
// A stand-in for a phone's speech engine: it stays silent until a speak() call is made during a tap (like iOS), then speaks at 12 ms per character.
const mock=`(()=>{let unlocked=false,inTap=false,q=[],cur=null,timer=null;window.__spoken=[];window.__blocked=0;
 document.addEventListener('click',()=>{inTap=true;setTimeout(()=>{inTap=false},0)},true);
 class U{constructor(t){this.text=t;this.volume=1;this.rate=1}}
 const next=()=>{if(cur||!q.length)return;cur=q.shift();ss.speaking=true;ss.pending=q.length>0;cur.onstart&&cur.onstart({});timer=setTimeout(()=>{const u=cur;cur=null;ss.speaking=false;if(u.volume>0&&u.text.trim())window.__spoken.push(u.text);u.onend&&u.onend({});next()},Math.max(30,u_len(cur)*12))};
 const u_len=u=>u.text.length;
 const ss={speaking:false,pending:false,paused:false,getVoices:()=>window.__voices||[],
  speak(u){if(!unlocked){if(inTap)unlocked=true;else{window.__blocked++;return}}q.push(u);ss.pending=true;setTimeout(next,5)},
  cancel(){const u=cur;q.forEach(x=>x.onerror&&x.onerror({error:'canceled'}));q=[];clearTimeout(timer);cur=null;ss.speaking=false;ss.pending=false;if(u&&u.onerror)u.onerror({error:'interrupted'})},
  pause(){},resume(){}};
 Object.defineProperty(window,'speechSynthesis',{value:ss,configurable:true});window.SpeechSynthesisUtterance=U;
 window.__lock=()=>{unlocked=false}})();`;
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:430,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(mock);await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(1500);
 await p.evaluate(()=>{window.__voices=[{name:'Samantha',voiceURI:'com.apple.voice.compact.en-US.Samantha',lang:'en-US',localService:true},{name:'Ava',voiceURI:'com.apple.voice.premium.en-US.Ava',lang:'en-US',localService:true},{name:'Daniel',voiceURI:'com.apple.voice.enhanced.en-GB.Daniel',lang:'en-GB',localService:true}];openAudio()});
 await p.waitForTimeout(200);
 console.log('voices:',await p.evaluate(()=>[...document.querySelectorAll('[data-adv]')].map(x=>x.textContent+(x.getAttribute('aria-pressed')==='true'?' [selected]':'')).join(' | ')));
 // 1. one tap on Start must produce speech
 await p.click('[data-arec="0"]').catch(()=>{});await p.click('#audstart');await p.waitForTimeout(2500);
 console.log('1 after ONE tap: spoken pieces',await p.evaluate(()=>window.__spoken.length),'blocked',await p.evaluate(()=>window.__blocked),'| first:',await p.evaluate(()=>(window.__spoken[0]||'').slice(0,60)),'| phase',await p.evaluate(()=>aud.phase+' pos '+aud.pos));
 // 2. pause then resume: the same fact is said again
 const before=await p.evaluate(()=>aud.pos);await p.click('#audpause');await p.waitForTimeout(600);const n1=await p.evaluate(()=>window.__spoken.length);await p.waitForTimeout(800);
 console.log('2 paused: no new speech',n1===await p.evaluate(()=>window.__spoken.length));
 await p.click('#audpause');await p.waitForTimeout(2500);console.log('  resumed: speaking again',await p.evaluate(()=>window.__spoken.length)>n1,'| same fact',before===await p.evaluate(()=>aud.pos)||'moved on');
 // 3. the engine goes silent (as after a lock screen): app must ask for a tap, not run on silently
 await p.evaluate(()=>{window.__lock();window.speechSynthesis.cancel()});const heard0=await p.evaluate(()=>aud.heard);await p.waitForTimeout(7500);
 console.log('3 engine silent: asks for tap',await p.evaluate(()=>!!document.getElementById('audtap')),'| facts counted meanwhile',await p.evaluate(()=>aud.heard)-heard0);
 const n2=await p.evaluate(()=>window.__spoken.length);await p.click('#audtap');await p.waitForTimeout(2500);
 console.log('  after tap: speaking again',await p.evaluate(()=>window.__spoken.length)>n2,'| tap box gone',await p.evaluate(()=>!document.getElementById('audtap')));
 // 4. skip and end
 await p.click('#audskip');await p.waitForTimeout(1200);await p.click('#audend');await p.waitForTimeout(300);console.log('4 end screen:',await p.evaluate(()=>document.querySelector('#view h2').textContent),'| heard',await p.evaluate(()=>aud.heard));
 // 5. sample button: one tap
 await p.click('#audagain');await p.waitForTimeout(200);const n3=await p.evaluate(()=>window.__spoken.length);await p.click('#audtest');await p.waitForTimeout(1500);console.log('5 sample after one tap:',await p.evaluate(()=>window.__spoken.length)>n3);
 await p.screenshot({path:'audio-setup.png',fullPage:true});console.log('errors',errs);await b.close()})();
