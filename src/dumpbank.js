const fs=require('fs');const out=[];let ty=0;
global.TY=y=>{ty=y};global.Q=(p,d,lv,s,c,w,e)=>out.push({p,d,lv,s,c,w,e,ty,f:global.__f});global.QX=()=>{};global.F=()=>{};
for(const f of process.argv.slice(2)){global.__f=f;for(const l of fs.readFileSync(f,'utf8').split('\n')){if(/^(Q|TY)\(/.test(l)){try{eval(l)}catch(e){}}}}
fs.writeFileSync('/tmp/bank.json',JSON.stringify(out));console.log(out.length);
