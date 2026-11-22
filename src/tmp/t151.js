const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
 await p.goto('http://localhost:8765/ea-exam-app/');await p.waitForTimeout(2000);await p.click('[data-sec="bk"]');await p.click('[data-mode="qbo"]');await p.click('[data-qtab="jobs"]');await p.click('[data-qj="fuel"]');await p.waitForTimeout(100);
 console.log(await p.evaluate(()=>{const out=[];document.querySelectorAll('#view *').forEach(el=>{const r=el.getBoundingClientRect();if(r.right>innerWidth+1&&el.children.length<3)out.push(el.tagName+'.'+el.className+' '+Math.round(r.width)+' '+(el.textContent||'').slice(0,30))});return out.slice(0,10)}));await b.close()})();
