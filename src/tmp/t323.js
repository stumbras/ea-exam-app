const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/ea-exam-app/?kids');await p.waitForTimeout(1200);
await p.evaluate(()=>{const k=KS();k.setup=1;k.name="T";k.sound=false;k.tix=99;k.adultUntil=Date.now()+9e5;k.guided=false;k.fly={lv:9,done:{0:1,1:1,2:1,3:1,4:1},stars:{},flights:0,pts:0};persist()});
const sim=(lv,ctl,T,pro)=>p.evaluate(([lv,ctl,T,pro])=>{kFly=null;kFlyStart(lv);const F=kFly;KV={scr:"x"};F.chk=null;F.pro=!!pro;F.easy=!pro;kFlyStep(F,0);Object.assign(F.wx,{t:"clear",turb:0,rain:0,wx:0,wz:0});F.em={on:false,t:1e9};F.atc.trafT=1e9;F.real=false;const says=[];const say0=kFlySay;kFlySay=(t,d)=>{if(says[says.length-1]!==t)says.push(t);return say0(t,d)};
  const fn=new Function("F","P","t","return ("+ctl+")(F,P,t)");const log=[];let t=0,dt=1/60,maxY=0,minV=99;for(;t<T;t+=dt){F.t+=dt;fn(F,F.P,t);kFlyStep(F,dt);try{kFlyGoal(F)}catch(_){ }if(F.crashT>0||F.q||F.won)break;maxY=Math.max(maxY,F.P.y);if(!F.P.gnd)minV=Math.min(minV,F.P.v);if(Math.round(t*60)%600===0)log.push([Math.round(t),Math.round(F.P.y),+F.P.v.toFixed(1),+(F.vy||0).toFixed(1),+F.P.th.toFixed(2)].join("/"))}
  kFlySay=say0;return JSON.stringify({glide:F.cut?+((F.gz||0)/F.cut.y).toFixed(1):undefined,t:Math.round(t),crash:F.crashT>0?F.crashMsg:null,won:!!(F.q||F.won),gnd:F.P.gnd,y:Math.round(F.P.y),v:+F.P.v.toFixed(1),maxY:Math.round(maxY),minV:+minV.toFixed(1),log:log.join(" "),says:says.slice(-3)})},[lv,ctl.toString(),T,pro]);
const pitch=(tgt)=>`(F,P,t)=>{P.thr=1;if(P.gnd){F.stick.y=P.v>26?0.6:0;return}F.stick.x=0;F.stick.y=Math.max(-1,Math.min(1,(${tgt}-P.th)*6))}`;
console.log('climb 8deg ',await sim(5,pitch(0.14),60));
console.log('climb 15deg',await sim(5,pitch(0.26),60));
console.log('climb 34deg',await sim(5,pitch(0.6),40));
console.log('turn 40deg no back pressure',await sim(5,`(F,P,t)=>{P.thr=.8;if(P.gnd){F.stick.y=P.v>26?0.6:0;return}if(P.y<200){F.stick.y=Math.max(-1,Math.min(1,(0.2-P.th)*6));F.stick.x=0}else{F.stick.y=0;F.stick.x=1}}`,90));
const land=`(F,P,t)=>{P.gear=1;P.flaps=1;const dist=Math.max(0,150-P.z);const hd=Math.max(0,(dist-0)*Math.tan(3.4*Math.PI/180));let tg=-0.06+(hd-P.y)*0.006;tg=Math.max(-0.16,Math.min(0.12,tg));P.thr=Math.max(0.12,Math.min(1,0.4+(26-P.v)*0.1));if(P.y<6&&!P.gnd){tg=-0.045;P.thr=0.14}if(P.gnd){P.thr=0;tg=0}F.stick.x=Math.max(-1,Math.min(1,-P.x*0.01-P.ph*2));F.stick.y=Math.max(-1,Math.min(1,(tg-P.th)*6))}`;
console.log('land easy  ',await sim(2,land,150));
console.log('land pro   ',await sim(2,land,150,1));
console.log('land idle hands off',await sim(2,`(F,P,t)=>{P.gear=1;P.flaps=1;P.thr=0;F.stick.x=0;F.stick.y=0}`,150));
console.log('glide no engine hands on',await sim(5,`(F,P,t)=>{if(P.y<250&&!F.cut){P.thr=1;if(P.gnd){F.stick.y=P.v>26?0.6:0;return}F.stick.y=Math.max(-1,Math.min(1,(0.2-P.th)*6));return}F.cut=F.cut||{z:P.z,y:P.y};P.thr=0;P.gear=0;const tg=P.v<27?-0.14:-0.07;F.stick.y=Math.max(-1,Math.min(1,(tg-P.th)*6));F.gz=P.z-F.cut.z}`,200));console.log('mission 0 easy takeoff',await sim(0,pitch(0.2),60));
console.log('errors',errs.slice(0,6));await b.close()})();
