// keyword coverage for a part: node t198.js PART kw1 kw2 ...
const fs=require('fs');global.BANK=[];global.hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h.toString(36)};
const html=fs.readFileSync('/home/claude/ea-app/pwa/index.html','utf8');
const P=+process.argv[2];const kws=process.argv.slice(3);
const items=[];const re=/(?:^|[;\n])\s*(Q|F)\((\d),(\d),([^\n]*)/g;let m;
while((m=re.exec(html))){if(+m[2]===P)items.push(m[1]+m[3]+' '+m[4].slice(0,400))}
for(const k of kws){const r=new RegExp(k,'i');const hits=items.filter(x=>r.test(x));console.log("["+k+"]",hits.length,hits.slice(0,2).map(h=>h.slice(0,110)).join(' || '))}
