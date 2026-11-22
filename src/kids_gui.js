/* ================= Desktop Lab: real point-and-click tasks on Windows 11, macOS and Linux Mint =================
   A pretend computer with files, folders, Trash, Settings (Wi-Fi, dark mode, updates), an app store, a task manager and search.
   12 missions per system; the computer remembers what you did, and each mission is checked from what you actually did. */
const KGN={win:{nm:"Windows 11",ic:"🪟",files:"File Explorer",fic:"📁",trash:"Recycle Bin",set:"Settings",store:"Microsoft Store",sic:"🛍️",task:"Task Manager",end:"End task",upd:"Windows Update",ext:"exe",search:"Search",del:"Delete"},
 mac:{nm:"macOS",ic:"🍎",files:"Finder",fic:"😀",trash:"Trash",set:"System Settings",store:"App Store",sic:"🅰️",task:"Force Quit",end:"Force Quit",upd:"Software Update",ext:"app",search:"Spotlight",del:"Move to Trash"},
 mint:{nm:"Linux Mint",ic:"🐧",files:"Files",fic:"📂",trash:"Trash",set:"System Settings",store:"Software Manager",sic:"🛒",task:"System Monitor",end:"End Process",upd:"Update Manager",ext:"AppImage",search:"Menu search",del:"Move to Trash"}};
const KGM=[
 ["Open your files",N=>`Open ${N.files}: tap its icon on the ${N===KGN.mac?"Dock":"taskbar"}.`,G=>G.win==="files"],
 ["Make a folder",N=>`In Documents, make a new folder named Rockets.`,G=>(G.fs.Documents||[]).some(x=>x.t==="d"&&x.n.toLowerCase()==="rockets")],
 ["Move a file",N=>`Find moon.png in Downloads and move it into Documents → Rockets (Cut, then Paste).`,G=>(G.fs["Documents/Rockets"]||[]).some(x=>x.n==="moon.png")&&!(G.fs.Downloads||[]).some(x=>x.n==="moon.png")],
 ["Rename a file",N=>`On the Desktop, rename "homework draft.txt" to "homework.txt".`,G=>(G.fs.Desktop||[]).some(x=>x.n==="homework.txt")],
 ["Delete a file",N=>`Delete "old game.${N.ext}" from the Desktop. It goes to the ${N.trash}.`,G=>(G.fs.Trash||[]).some(x=>x.n.startsWith("old game"))],
 ["Restore from the trash",N=>`Oops, you need it back! Open the ${N.trash} and restore "old game.${N.ext}".`,G=>(G.fs.Desktop||[]).some(x=>x.n.startsWith("old game"))&&!(G.fs.Trash||[]).some(x=>x.n.startsWith("old game"))],
 ["Connect to Wi-Fi",N=>`Open ${N.set}, turn Wi-Fi on and connect to Home-WiFi.`,G=>G.set.net==="Home-WiFi"],
 ["Dark mode",N=>`In ${N.set}, switch the look to Dark.`,G=>G.set.dark===1],
 ["Install an app",N=>`Open the ${N.store} and install Scratch (the coding app).`,G=>!!G.inst.Scratch],
 ["Stop a frozen app",N=>`Space Game froze! Open ${N.task} and ${N.end.toLowerCase()} on it.`,G=>!G.procs.some(p=>p.fz)],
 ["Search for a file",N=>`Use ${N.search} to find tesla.jpg and open it.`,G=>G.opened==="tesla.jpg"],
 ["Install updates",N=>`Open ${N.set} → ${N.upd}, check for updates and install them.`,G=>G.set.upd===2]];
function kGuiLv(os){return ((KS().term||{}).gui||{})[os]||0}
function kGuiNew(os){const N=KGN[os];const G={os,win:null,cwd:"Desktop",sel:null,clip:null,mode:null,opened:null,search:false,fs:{Desktop:[{n:"homework draft.txt",t:"f",ic:"📄"},{n:"old game."+N.ext,t:"f",ic:"🎮"},{n:"Minecraft",t:"f",ic:"🟩"}],
   Documents:[{n:"book report.docx",t:"f",ic:"📝"}],Downloads:[{n:"moon.png",t:"f",ic:"🌕"},{n:"tesla.jpg",t:"f",ic:"🚗"}],Pictures:[{n:"cat.jpg",t:"f",ic:"🐱"},{n:"rocket launch.png",t:"f",ic:"🚀"}],Trash:[]},
   inst:{},set:{wifi:0,net:null,dark:0,upd:0},procs:[{n:"Space Game",fz:1,ic:"🎮"},{n:"Browser",ic:"🌐"},{n:"Notes",ic:"📝"}]};
  const L=kGuiLv(os);if(L>1){G.fs.Documents.push({n:"Rockets",t:"d"});G.fs["Documents/Rockets"]=[]}if(L>2){G.fs.Downloads=G.fs.Downloads.filter(x=>x.n!=="moon.png");G.fs["Documents/Rockets"].push({n:"moon.png",t:"f",ic:"🌕"})}
  if(L>3)G.fs.Desktop[0].n="homework.txt";if(L>6){G.set.wifi=1;G.set.net="Home-WiFi"}if(L>7)G.set.dark=1;if(L>8)G.inst.Scratch=1;if(L>9)G.procs=G.procs.filter(p=>!p.fz);if(L>11)G.set.upd=2;return G}
function kGuiStart(os){KV={scr:"gui",G:kGuiNew(os||KV.gos||"win"),msg:""};KV.gos=KV.G.os}
function kGuiCheck(){const G=KV.G,os=G.os,L=kGuiLv(os),M=KGM[L];if(!M||!M[2](G))return;const k=KS();k.term=k.term||{};k.term.gui=k.term.gui||{};k.term.gui[os]=L+1;k.coins+=8;k.xp+=20;
  KV.msg=`✅ ${M[0]}! Real ${KGN[os].nm} skill learned. +8 ⚡`;kBeep("ok");kLine(`${M[0]}. Nice work!`,2);try{kRotDone("term")}catch(_){}
  if(L+1>=KGM.length)kTrophy("gui"+os,KGN[os].ic,`${KGN[os].nm} Power User!`,`Did all ${KGM.length} real tasks on ${KGN[os].nm}: files, trash, Wi-Fi, apps, updates.`);try{kDay(k);kBadges()}catch(_){}persist()}
function kGuiItems(G,p){return G.fs[p]||[]}
function kGuiClick(d){const G=KV.G;if(!G)return;const N=KGN[G.os],a=d.kg,x=d.x;KV.msg="";
  if(a==="os"){kGuiStart(x);return}if(a==="reset"){KV.G=kGuiNew(G.os);return}
  if(a==="open"){G.win=x;G.mode=null;G.sel=null;G.search=false;if(x==="files"&&!G.cwd)G.cwd="Desktop";kBeep("click")}
  if(a==="close"){G.win=null;G.sel=null;G.mode=null}
  if(a==="cd"){G.cwd=x;G.sel=null;G.mode=null}
  if(a==="sel"){const it=kGuiItems(G,G.cwd)[+x];if(it&&it.t==="d"&&G.sel===+x){G.cwd=G.cwd+"/"+it.n;G.sel=null}else G.sel=+x}
  if(a==="dsel"){G.win="files";G.cwd="Desktop";G.sel=+x}
  if(a==="up"){const p=G.cwd.split("/");p.pop();G.cwd=p.join("/")||"Desktop";G.sel=null}
  if(a==="newdir"){G.mode="newdir"}
  if(a==="ren"){G.mode="ren"}
  if(a==="ok"){const v=((document.getElementById("kgin")||{}).value||"").trim();if(!v){KV.msg="Type a name first.";return}const L=kGuiItems(G,G.cwd);
    if(G.mode==="newdir"){if(L.some(i=>i.n.toLowerCase()===v.toLowerCase())){KV.msg="That name is taken.";return}L.push({n:v,t:"d"});G.fs[G.cwd+"/"+v]=[];kBeep("ok")}
    if(G.mode==="ren"&&G.sel!=null&&L[G.sel]){L[G.sel].n=v;kBeep("ok")}G.mode=null}
  if(a==="cancel")G.mode=null;
  if(a==="cut"||a==="copy"){const it=kGuiItems(G,G.cwd)[G.sel];if(it){G.clip={from:G.cwd,it:Object.assign({},it),cut:a==="cut"};KV.msg=a==="cut"?`✂️ Cut "${it.n}". Now open the folder you want and tap Paste.`:`📋 Copied "${it.n}".`}}
  if(a==="paste"&&G.clip){const L=kGuiItems(G,G.cwd);if(!G.fs[G.cwd])G.fs[G.cwd]=L;if(L.some(i=>i.n===G.clip.it.n)&&!G.clip.cut){G.clip.it.n=G.clip.it.n.replace(/(\.[^.]+)?$/," copy$1")}L.push(Object.assign({},G.clip.it));if(G.clip.cut){G.fs[G.clip.from]=kGuiItems(G,G.clip.from).filter(i=>i.n!==G.clip.it.n);G.clip=null}kBeep("ok")}
  if(a==="del"){const L=kGuiItems(G,G.cwd),it=L[G.sel];if(it){G.fs[G.cwd]=L.filter((_,i)=>i!==G.sel);G.fs.Trash.push(Object.assign({from:G.cwd},it));G.sel=null;kBeep("click");KV.msg=`🗑️ Moved to the ${N.trash}. You can still restore it.`}}
  if(a==="restore"){const it=G.fs.Trash[G.sel];if(it){G.fs.Trash=G.fs.Trash.filter((_,i)=>i!==G.sel);const to=it.from||"Desktop";(G.fs[to]=G.fs[to]||[]).push({n:it.n,t:it.t,ic:it.ic});G.sel=null;kBeep("ok");KV.msg=`♻️ Restored to ${to}.`}}
  if(a==="empty"){if(G.fs.Trash.length){G.fs.Trash=[];KV.msg=`🔥 ${N.trash} emptied: those files are gone for good.`}}
  if(a==="fopen"){const it=kGuiItems(G,G.cwd)[+x];if(it){if(it.t==="d"){G.cwd=G.cwd+"/"+it.n;G.sel=null}else{G.opened=it.n;G.win="view";G.view=it}}}
  if(a==="wifi"){G.set.wifi=G.set.wifi?0:1;if(!G.set.wifi)G.set.net=null}
  if(a==="net"&&G.set.wifi){if(x==="Neighbor-5G"){KV.msg="🔒 That network needs a password you don't have. Pick your own network.";kBeep("no")}else{G.set.net=x;kBeep("ok")}}
  if(a==="dark")G.set.dark=+x;
  if(a==="upd"){if(G.set.upd===0){G.set.upd=1;KV.msg="Found 1 security update."}else if(G.set.upd===1){G.set.upd=2;KV.msg="✅ Updates installed. You're up to date!"}}
  if(a==="get"){G.inst[x]=1;kBeep("coin");KV.msg=`📲 ${x} installed!`}
  if(a==="pick")G.psel=+x;
  if(a==="end"){const p=G.procs[G.psel];if(p){G.procs=G.procs.filter((_,i)=>i!==G.psel);G.psel=null;kBeep(p.fz?"ok":"no");if(!p.fz)KV.msg=`Hmm, ${p.n} was working fine. Only stop the one that's "Not responding".`}}
  if(a==="search"){G.search=!G.search;G.q=""}
  if(a==="q"){G.q=((document.getElementById("kgq")||{}).value||"").trim().toLowerCase()}
  if(a==="hit"){const [p,n]=x.split("|");const it=kGuiItems(G,p).find(i=>i.n===n);if(it){G.opened=n;G.win="view";G.view=it;G.search=false}}
  kGuiCheck()}
function kGuiWin(G,N){const os=G.os,title={files:N.files,settings:N.set,store:N.store,task:N.task,trash:N.trash,view:G.view?G.view.n:""}[G.win];
  const bar=os==="mac"?`<div class="gbar"><span class="gtl"><button data-kg="close" class="r"></button><i class="y"></i><i class="g"></i></span><b>${esc(title)}</b></div>`:`<div class="gbar"><b>${esc(title)}</b><span class="gbtns">— ☐ <button data-kg="close">✕</button></span></div>`;
  let body="";
  if(G.win==="files"||G.win==="trash"){const cwd=G.win==="trash"?"Trash":G.cwd,L=kGuiItems(G,cwd),isT=cwd==="Trash",it=L[G.sel];
    body=`<div class="gfiles"><div class="gside">${["Desktop","Documents","Downloads","Pictures","Trash"].map(p=>`<button data-kg="cd" data-x="${p}" class="${cwd.split("/")[0]===p?"on":""}">${{Desktop:"🖥️",Documents:"📄",Downloads:"⬇️",Pictures:"🖼️",Trash:"🗑️"}[p]} ${p==="Trash"?N.trash:p}</button>`).join("")}</div>
     <div class="gmain"><div class="gpath">${cwd.includes("/")?`<button data-kg="up">⬅</button>`:""}<span>${esc(cwd.replace("Trash",N.trash).split("/").join(" › "))}</span>${!isT?`<button data-kg="newdir">＋ New folder</button>`:""}${G.clip&&!isT?`<button data-kg="paste">📋 Paste</button>`:""}</div>
      ${G.mode?`<div class="gin"><input id="kgin" placeholder="${G.mode==="newdir"?"Folder name":"New name"}" value="${G.mode==="ren"&&it?esc(it.n):""}" autocomplete="off"><button data-kg="ok">OK</button><button data-kg="cancel">✕</button></div>`:""}
      <div class="ggrid">${L.length?L.map((f,i)=>`<button class="gitem ${G.sel===i?"on":""}" data-kg="sel" data-x="${i}"><span>${f.t==="d"?(os==="mac"?"📁":"📁"):f.ic}</span><em>${esc(f.n)}</em></button>`).join(""):`<div class="gempty">${isT?"The "+N.trash+" is empty":"This folder is empty"}</div>`}</div>
      ${it?`<div class="gact">${isT?`<button data-kg="restore">♻️ Restore</button><button data-kg="empty">🔥 Empty ${N.trash}</button>`:`<button data-kg="fopen" data-x="${G.sel}">Open</button><button data-kg="ren">✏️ Rename</button><button data-kg="cut">✂️ Cut</button><button data-kg="copy">📋 Copy</button><button data-kg="del">🗑️ ${N.del}</button>`}</div>`:`<div class="gtip">Tap a file to select it${!isT?" · tap a folder twice to open it":""}.</div>`}</div></div>`}
  if(G.win==="settings"){const S=G.set;body=`<div class="gset"><div class="gsrow"><b>📶 Wi-Fi</b><button class="gtog ${S.wifi?"on":""}" data-kg="wifi"><i></i></button></div>
     ${S.wifi?["Home-WiFi","Neighbor-5G"].map(n=>`<button class="gnet ${S.net===n?"on":""}" data-kg="net" data-x="${n}">${n==="Neighbor-5G"?"🔒":"📶"} ${n}${S.net===n?" · Connected ✓":""}</button>`).join(""):`<div class="gtip">Wi-Fi is off.</div>`}
     <div class="gsrow"><b>🎨 Appearance</b><span><button class="gseg ${!S.dark?"on":""}" data-kg="dark" data-x="0">☀️ Light</button><button class="gseg ${S.dark?"on":""}" data-kg="dark" data-x="1">🌙 Dark</button></span></div>
     <div class="gsrow"><b>🔄 ${N.upd}</b><button class="gbtn" data-kg="upd">${S.upd===0?"Check for updates":S.upd===1?"Install 1 update":"✅ Up to date"}</button></div></div>`}
  if(G.win==="store")body=`<div class="gstore">${[["Scratch","🐱","Make games with code blocks"],["Minecraft Education","🟩","Build and learn"],["Calculator","🧮","Already on your computer"]].map(([n,ic,dsc])=>`<div class="gapp"><span>${ic}</span><div><b>${n}</b><em>${dsc}</em></div>${G.inst[n]||n==="Calculator"?`<button disabled>Installed ✓</button>`:`<button data-kg="get" data-x="${n}">${G.os==="win"?"Get":G.os==="mac"?"GET":"Install"}</button>`}</div>`).join("")}</div>`;
  if(G.win==="task")body=`<div class="gtask">${G.procs.map((p,i)=>`<button class="gproc ${G.psel===i?"on":""}" data-kg="pick" data-x="${i}"><span>${p.ic} ${p.n}</span><em class="${p.fz?"fz":""}">${p.fz?"Not responding ❄️":"Running"}</em></button>`).join("")}<button class="gbtn red" data-kg="end" ${G.psel==null?"disabled":""}>${N.end}</button></div>`;
  if(G.win==="view")body=`<div class="gview"><div>${G.view.ic||"📄"}</div><b>${esc(G.view.n)}</b></div>`;
  return `<div class="gwin">${bar}<div class="gbody">${body}</div></div>`}
function kGuiView(v){if(!KV.G)kGuiStart(KV.gos);const G=KV.G,os=G.os,N=KGN[os],L=kGuiLv(os),M=KGM[L];
  const dock=[["files",N.fic,N.files],["settings","⚙️",N.set],["store",N.sic,N.store],["task",os==="win"?"📊":os==="mac"?"⛔":"📈",N.task],["trash","🗑️",N.trash]];
  const desk=`<div class="gdesk">${(G.fs.Desktop||[]).map((f,i)=>`<button class="gdi" data-kg="dsel" data-x="${i}"><span>${f.ic}</span><em>${esc(f.n)}</em></button>`).join("")}${os==="win"?`<button class="gdi" data-kg="open" data-x="trash"><span>🗑️</span><em>${N.trash}</em></button>`:""}</div>`;
  const search=G.search?`<div class="gsearch"><input id="kgq" placeholder="Type to search…" value="${esc(G.q||"")}" autocomplete="off"><button data-kg="q">🔍</button>${G.q?Object.keys(G.fs).filter(p=>p!=="Trash").flatMap(p=>G.fs[p].filter(f=>f.n.toLowerCase().includes(G.q)).map(f=>`<button class="ghit" data-kg="hit" data-x="${esc(p)}|${esc(f.n)}">${f.ic||"📁"} ${esc(f.n)} <em>${esc(p)}</em></button>`)).join("")||`<div class="gtip">No results</div>`:""}</div>`:"";
  const top=os==="mac"?`<div class="gmenu">🍎 <b>${G.win?({files:"Finder"}[G.win]||N.set):"Finder"}</b> File Edit View<span>${G.set.wifi?"📶":"📵"} <button data-kg="search">🔍</button> 9:41</span></div>`:"";
  const bottom=os==="win"?`<div class="gtaskbar"><button data-kg="search" title="Start">⊞</button>${dock.slice(0,4).map(d=>`<button data-kg="open" data-x="${d[0]}" class="${G.win===d[0]?"on":""}">${d[1]}</button>`).join("")}<span>${G.set.wifi?"📶":"📵"} 9:41</span></div>`
   :os==="mac"?`<div class="gdock">${dock.map(d=>`<button data-kg="open" data-x="${d[0]}" class="${G.win===d[0]?"on":""}" title="${d[2]}">${d[1]}</button>`).join("")}</div>`
   :`<div class="gpanel"><button data-kg="search">❖ Menu</button>${dock.map(d=>`<button data-kg="open" data-x="${d[0]}" class="${G.win===d[0]?"on":""}">${d[1]}</button>`).join("")}<span>${G.set.wifi?"📶":"📵"} 9:41</span></div>`;
  const tabs=Object.keys(KGN).map(o=>`<button class="kostab ${o===os?"on":""}" data-kg="os" data-x="${o}">${KGN[o].ic} ${KGN[o].nm} <i>${kGuiLv(o)}/${KGM.length}</i></button>`).join("");
  v.innerHTML=`<div class="kids">${kToastHtml()}${kTop("🖥️ Desktop Lab","term")}<div class="kostabs">${tabs}</div>
   ${M?`<div class="kcard tmis"><div class="ksmall">REAL TASK ${L+1} OF ${KGM.length} · ${N.nm}</div><div class="kh">🖱️ ${esc(M[0])}</div><div>${esc(M[1](N))}</div>${KV.msg?`<div class="gmsg ${KV.msg.startsWith("✅")?"ok":""}">${esc(KV.msg)}</div>`:""}</div>`
     :`<div class="kcard kend"><h2>🏆 ${N.nm} Power User!</h2><p>You did all ${KGM.length} real tasks. Try them on a real computer with a grown-up!</p>${KV.msg?`<div class="gmsg ok">${esc(KV.msg)}</div>`:""}</div>`}
   <div class="kgui os-${os} ${G.set.dark?"dark":""}">${top}${desk}${G.win?kGuiWin(G,N):""}${search}${bottom}</div>
   <div class="ksmall" style="margin-top:6px">Tap icons like on a real computer. <button class="kbtn ghost small" data-kg="reset">↺ Fresh computer</button></div></div>`}
