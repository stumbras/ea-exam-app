/* ================= Tidy pass: short start pages, the Go button first =================
   Found by an audit of every screen at phone size: several start pages had grown to 2 to 6 screens, with the Play button
   at the very bottom. This pass keeps what he acts on at the top and folds reference text away (one tap to open):
   - Brick Bay: Drive button right under the title; how-to and building list folded
   - Sky Pilot: missions first as short rows (only the next one shows its lesson); flight manual and settings folded
   - Tesla Drive: garage (paint, horn, mods) folded; the "earn a ticket" card only when tickets are low
   - Learning Center: activities first; the 67-tile Explorer map becomes a one-line bar
   - Daily Genius: the 34-topic performance list folded under its three numbers
   - Home: Mission Path shows the next step big and the other two as one-line rows */
const KFOLD={};
try{document.addEventListener("toggle",e=>{const t=e.target;if(t&&t.classList&&t.classList.contains("kfold")&&t.dataset.fid)KFOLD[t.dataset.fid]=t.open},true)}catch(_){}
function kFold(nodes,id,title,sub){nodes=nodes.filter(Boolean);if(!nodes.length)return null;const d=document.createElement("details");d.className="kfold";d.dataset.fid=id;if(KFOLD[id])d.open=true;
  d.innerHTML=`<summary><b>${title}</b><span>${sub||""}</span><i>▾</i></summary>`;nodes[0].parentNode.insertBefore(d,nodes[0]);const box=document.createElement("div");box.className="kfoldb";d.appendChild(box);nodes.forEach(n=>box.appendChild(n));return d}
function kCardBy(root,re){return[...root.querySelectorAll(".kcard")].find(c=>{const h=c.querySelector(".kh");return h&&re.test(h.textContent)})}
function kTidyHook(v){try{const root=v.querySelector(".kids");if(!root||root.dataset.tidy)return;root.dataset.tidy="1";const k=KS(),scr=KV.scr||"home";
  if(scr==="city"&&!v.querySelector("#kcty")){const go=root.querySelector('[data-k="cityGo"]'),hero=root.querySelector(".kcityhero");if(go&&hero){const note=go.nextElementSibling;hero.after(go);if(note&&note.classList.contains("ksmall")){go.after(note);note.style.textAlign="center"}go.style.width="100%";go.style.margin="10px 0 4px"}
    kFold([kCardBy(root,/How to play/),kCardBy(root,/Buildings to walk/)],"city","📖 How to play","missions, police, jets, 16 buildings to walk into")}
  if(scr==="drive"&&KV.pick){const earn=[...root.children].find(c=>/Earn your next ticket/.test(c.textContent)&&c.textContent.length<500);if(earn&&(k.tix||0)>=3)earn.remove();
    const go=[...root.querySelectorAll(".kbtn.big.green")].find(b=>b.dataset.kride!==undefined||b.dataset.kderby!==undefined);if(go)go.classList.add("kstick");
    const paint=kCardBy(root,/Paint/)||[...root.querySelectorAll(".kcard")].find(c=>/Paint/.test(c.textContent)&&/horn/i.test(c.textContent));kFold([paint],"garage","🎨 Garage","paint, horn, Easter eggs, tilt steering")}
  if(scr==="fly"&&(typeof kFly==="undefined"||!kFly)){const ms=[...root.querySelectorAll(".kcard")].filter(c=>c.querySelector("[data-kflym]"));if(ms.length){
      const next=ms.find(c=>!c.classList.contains("klock")&&c.classList.contains("kneg"))||ms.find(c=>!c.classList.contains("klock"));ms.forEach(c=>{if(c===next)c.classList.add("kfmn");else c.classList.add("kfmc")});
      const man=kFold([kCardBy(root,/four forces/),kCardBy(root,/How to fly/),kCardBy(root,/Pilot instruments/)],"flyman","📘 Flight manual","four forces, controls, instruments, PAPI, climb rule");if(man)ms[ms.length-1].after(man);
      kFold([kCardBy(root,/Pilot settings/)],"flyset","⚙️ Pilot settings","real controls, Pro mode, Free Flight aircraft")}}
  if(scr==="learnhub"){const cov=kCardBy(root,/Explorer map/);if(cov){let sub="";try{const A=kCovAreas(),S=A.map(kCovStat);sub=`${S.filter(s=>s.st>0).length} of ${A.length} areas explored · ${S.filter(s=>s.st===2).length} strong`}catch(_){}const d=kFold([cov],"cov","🧭 Explorer map",sub);if(d)root.appendChild(d)}}
  if(scr==="genius"){const perf=kCardBy(root,/Genius performance/);if(perf){const rows=[...perf.querySelectorAll(".kgrow")];if(rows.length>6){const d=kFold(rows,"gperf",`📋 All ${rows.length} topics`,"weakest first");if(d)d.classList.add("in")}}}
  }catch(_){}}
