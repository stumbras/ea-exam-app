/* ================= Brick Bay 3: walk into buildings that lead to every game, hack the vault, escape by plane =================
   Game buildings open a door menu; the city waits (paused) and a "Back to Brick Bay" button brings him back.
   Hack buildings (Bank Vault, City Control) use Computer Lab skills. During a police chase, the Airport is the getaway. */
const KCTBG=[["chessclub","♟️","Chess Club","Chess puzzles and Robot Chess"],["pokerroom","🃏","Poker Room","Texas Hold'em table"],["mjparlor","🀄","Mahjong Parlor","Manila mahjong"],
 ["arcade","🕹️","Arcade","Tesla Drive, Mechazilla, Block Miner, Mars Colony"],["studio","🎤","Game Show Studio","Quiz Show and Genius Quiz"],["school","🎓","School","Lessons, Spelling Bee, Daily Genius"],
 ["hackhq","💻","Hacker HQ","Computer Academy and Tesla Hacker"],["airport","🛫","Airport","Fly a mission"],["vault","🔐","Bank Vault","Hack the vault: 3 code puzzles"],["ctrl","🚦","City Control","Hack the city: turn every light green"]];
const KCTMENU={chessclub:[["chess","","♞ Chess Quest (puzzles)"],["chessbot","","🤖 Robot Chess (full games)"]],pokerroom:[["poker","","🃏 Poker Academy"]],mjparlor:[["mj","","🀄 Filipino Mahjong"]],
 arcade:[["drive","","🚗 Tesla Drive & Derby"],["","mz","🦾 Mechazilla Catch"],["mine","","⛏️ Block Miner"],["col","","🔴 Mars Colony"]],studio:[["show","","🎤 Quiz Show"],["genius","","🧠 Daily Genius & Genius Quiz"]],
 school:[["learn","","🎓 Genius Lessons"],["genius","","🧠 Daily Genius"],["learnhub","","📚 Learning Center"]],hackhq:[["term","","💻 Computer Academy"],["","hack","🚗 Tesla Hacker"]],airport:[["fly","","✈️ Sky Pilot"],["pschool","","🚀 Pilot School"]]};
function kCtEnter3(B){const D=kCt;if(KCTMENU[B.k]){D.inside={B,menu:1};D.joy=null;kBeep("click");kLine(`Welcome to the ${B.nm}!`,2);render();return true}return false}
function kCtMenuHtml(D){const I=D.inside,B=I.B,chase=B.k==="airport"&&D.cops&&D.cops.length;const k=KS();
  return `<div class="kdbq kctin kctmenu"><div class="kh">${B.ic} ${esc(B.nm)}</div><div class="ksmall">${esc(B.desc)}. Brick Bay waits for you while you play.</div>
   ${chase?`<button class="kbtn big red" data-ctgo="1" data-ctesc="1" data-k="fly" style="width:100%;margin-top:8px">✈️ ESCAPE BY AIR! (+$100)</button>`:""}
   <div class="kctmb">${KCTMENU[B.k].map(([dk,tw,t])=>`<button class="kbtn big" data-ctgo="1" ${dk?`data-k="${dk}"`:`data-ktw="${tw}"`} style="width:100%">${t}</button>`).join("")}</div>
   <button class="kbtn ghost" data-kctout="1" style="width:100%;margin-top:6px">🚪 Back to the street</button></div>`}
const KHACKQ=[["💻 Which command lists the files in a folder?","ls","cd","rm"],["🧭 Which command moves you into another folder?","cd","ls","cat"],["📄 Which command shows what's inside a file?","cat","mkdir","pwd"],
 ["📁 Which command makes a new folder?","mkdir","rm","ls"],["🔢 Binary 101 is which normal number?","5","3","101"],["🔢 1 + 1 in binary is…","10","2","11"],["🔑 Which password is strongest?","Tiger!Moon42#Rain","123456","password"],
 ["🕵️ An email says 'Click to win free Robux!' A smart hacker…","Doesn't click: it's phishing","Clicks fast","Sends their password"],["🗝️ Two-factor login means…","A password plus a code","Two passwords on a sticky note","No password at all"],
 ["🧮 If x = 3, what does print(x * 2) show?","6","32","x2"],["🔁 Which one is a loop?","repeat 4 times","if it rains","print hi"],["⚡ Ctrl + C copies. Ctrl + V…","Pastes","Closes","Crashes"],
 ["🌐 What does a firewall do?","Blocks bad network traffic","Puts out fires","Charges the laptop"],["🧠 'if lights == red: stop' is an…","IF rule (condition)","Loop","Password"],["📶 Which keeps Wi-Fi safest?","A long Wi-Fi password","No password","Sharing it online"]];
function kCtHackQ(){return kShuf(KHACKQ).slice(0,3).map(x=>({q:x[0],o:[x[1],x[2],x[3]],a:0}))}
function kCtHackDone(D,I){const k=KS();k.city.hacks=k.city.hacks||{vault:0,ctrl:0};
  if(I.right===3){if(I.B.k==="vault"){D.money+=150;D.score+=300;k.city.hacks.vault++;kCtSay("🔓 VAULT CRACKED! +$150. Real hackers use these skills to PROTECT banks!",4);kBeep("kaching");kTrophy("vault1","🔓","Vault hacker!","Cracked the Brick Bay bank vault with code skills.")}
    else{D.money+=80;D.score+=200;k.city.hacks.ctrl++;(D.bots||[]).forEach(b=>b.caught=1);D.botT=240;D.green=60;kCtSay("🚦 CITY HACKED! Every light is green and the robber bots froze. +$80",4);kBeep("levelup");kTrophy("ctrl1","🚦","City controller!","Hacked Brick Bay's traffic control.")}}
  else{kCtSay(`🔒 Security stopped you (${I.right}/3). Practice in 💻 Hacker HQ, then try again!`,4);kBeep("no")}
  D.inside=null;persist()}
function kCtQdTrack(ok,fast){const k=KS();k.city=k.city||{};const Q=k.city.qd=k.city.qd||{n:0,ok:0,fast:0,best:0,run:0,h:[]};Q.n++;if(ok){Q.ok++;Q.run++;if(fast)Q.fast++;Q.best=Math.max(Q.best,Q.run)}else Q.run=0;Q.h.push(ok?1:0);if(Q.h.length>20)Q.h.shift()}
function kCtQdStatsHtml(){const Q=(KS().city||{}).qd;if(!Q||!Q.n)return `<div class="ksmall">⚡ Quick decisions pop up while you drive. Answer fast for combos. Your stats will show here.</div>`;
  const p=Math.round(Q.ok/Q.n*100),last=Q.h.length?Math.round(Q.h.reduce((a,b)=>a+b,0)/Q.h.length*100):p;
  return `<div class="kqdst"><div><b>${Q.n}</b><span>answered</span></div><div><b>${p}%</b><span>right</span></div><div><b>${last}%</b><span>last ${Q.h.length}</span></div><div><b>${Q.best}</b><span>best streak</span></div></div><div class="kqdbar">${Q.h.map(x=>`<i class="${x?"ok":"no"}"></i>`).join("")}</div>`}
function kFlowHook(v){try{if(window.kCtRet&&KV.scr!=="city"&&typeof kCt!=="undefined"&&kCt&&!kCt.over){const host=v.querySelector(".kids")||v;if(!host.querySelector(".kctback")){const b=document.createElement("button");b.className="kctback";b.dataset.k="cityback";b.textContent="🌴 Back to Brick Bay";host.appendChild(b)}}}catch(_){}}
function kCt3Click(d){if(d.kctout){if(typeof kCt!=="undefined"&&kCt)kCt.inside=null;return true}
  if(d.k==="cityback"){window.kCtRet=false;KV={scr:"city"};return true}
  if(d.ctgo){window.kCtRet=true;const D=typeof kCt!=="undefined"?kCt:null;if(D)D.inside=null;
    if(d.ctesc&&D&&D.cops&&D.cops.length){D.cops=[];D.money+=100;D.score+=150;const k=KS();k.city.escapes=(k.city.escapes||0)+1;kTrophy("escape1","✈️","Getaway pilot!","Escaped the Brick Bay police by plane.");kT("✈️ You escaped the police by plane! +$100. Now fly the getaway mission!");window.kFlyGetaway=1}}
  return false}
