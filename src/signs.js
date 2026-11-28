/* Road sign and signal pictures for the driver, motorcycle and CDL tests. Drawn in SVG, no words on the signs so the shape and colour teach. */
(function(){
const W=(inner,vb)=>`<svg viewBox="${vb||"0 0 120 120"}" width="120" height="120" role="img" aria-hidden="true">${inner}</svg>`;
const oct=c=>`<polygon points="35,4 85,4 116,35 116,85 85,116 35,116 4,85 4,35" fill="${c}" stroke="#fff" stroke-width="5"/><polygon points="35,4 85,4 116,35 116,85 85,116 35,116 4,85 4,35" fill="none" stroke="#7a0f12" stroke-width="1.5"/>`;
const dia=(c,in_)=>`<rect x="22" y="22" width="76" height="76" rx="6" transform="rotate(45 60 60)" fill="${c}" stroke="#111" stroke-width="3"/>${in_||""}`;
const light=(on,kind)=>{const col={r:"#e5322d",y:"#f6b400",g:"#1fa34a"},off="#3a3f45";
  const lamp=(k,cy)=>{const lit=on===k;const c=lit?col[k]:off;
    if(lit&&kind==="arrow")return `<circle cx="60" cy="${cy}" r="15" fill="#15181c"/><path d="M68 ${cy-6}h-10v-6l-12 12 12 12v-6h10z" transform="rotate(0)" fill="${c}"/>`;
    return `<circle cx="60" cy="${cy}" r="15" fill="${c}"${lit?` style="filter:drop-shadow(0 0 6px ${c})"`:""}>${lit&&kind==="flash"?`<animate attributeName="opacity" values="1;.15;1" dur="1.1s" repeatCount="indefinite"/>`:""}</circle>`};
  return `<rect x="38" y="6" width="44" height="108" rx="10" fill="#1d2126" stroke="#000" stroke-width="2"/>${lamp("r",28)}${lamp("y",60)}${lamp("g",92)}`};
const road=inner=>`<rect x="0" y="0" width="120" height="120" rx="10" fill="#5b6066"/>${inner}`;
const P=[
 [/eight-sided|octagon/i,()=>oct("#c8102e")],
 [/triangle pointing down|yield sign/i,()=>`<polygon points="8,14 112,14 60,106" fill="#fff" stroke="#c8102e" stroke-width="16" stroke-linejoin="round"/>`],
 [/round yellow sign|round.{0,20}railroad/i,()=>`<circle cx="60" cy="60" r="54" fill="#ffd200" stroke="#111" stroke-width="4"/><path d="M28 28L92 92M92 28L28 92" stroke="#111" stroke-width="9"/><text x="27" y="68" font-size="22" font-weight="800" font-family="Arial">R</text><text x="80" y="68" font-size="22" font-weight="800" font-family="Arial">R</text>`],
 [/five-sided|pentagon/i,()=>`<polygon points="60,6 112,46 112,114 8,114 8,46" fill="#c4e000" stroke="#111" stroke-width="4"/>`],
 [/fluorescent yellow-green/i,()=>dia("#c4e000")],
 [/fluorescent pink/i,()=>dia("#ff4fa3")],
 [/orange sign|work zone sign/i,()=>dia("#ff7a00")],
 [/chevron/i,()=>`<rect x="16" y="6" width="88" height="108" rx="6" fill="#ffd200" stroke="#111" stroke-width="3"/><path d="M42 26l30 34-30 34" fill="none" stroke="#111" stroke-width="16"/>`],
 [/pennant/i,()=>`<polygon points="4,24 116,60 4,96" fill="#ffd200" stroke="#111" stroke-width="4"/>`],
 [/crossbuck/i,()=>`<rect x="56" y="40" width="8" height="78" fill="#888"/><g transform="rotate(35 60 40)"><rect x="4" y="30" width="112" height="20" rx="3" fill="#fff" stroke="#111" stroke-width="3"/></g><g transform="rotate(-35 60 40)"><rect x="4" y="30" width="112" height="20" rx="3" fill="#fff" stroke="#111" stroke-width="3"/></g>`],
 [/yellow, diamond|diamond-shaped/i,()=>dia("#ffd200")],
 [/red circle with a red slash/i,()=>`<rect x="10" y="10" width="100" height="100" rx="6" fill="#fff" stroke="#111" stroke-width="3"/><circle cx="60" cy="60" r="38" fill="none" stroke="#c8102e" stroke-width="9"/><path d="M33 33L87 87" stroke="#c8102e" stroke-width="9"/>`],
 [/white rectangular/i,()=>`<rect x="20" y="8" width="80" height="104" rx="6" fill="#fff" stroke="#111" stroke-width="4"/><rect x="34" y="30" width="52" height="7" fill="#111"/><rect x="34" y="50" width="52" height="7" fill="#111"/><rect x="34" y="70" width="52" height="22" rx="2" fill="#111"/>`],
 [/green highway sign/i,()=>`<rect x="6" y="22" width="108" height="76" rx="8" fill="#006b3f" stroke="#fff" stroke-width="4"/><rect x="20" y="40" width="80" height="8" fill="#fff"/><rect x="20" y="58" width="56" height="8" fill="#fff"/><path d="M84 74l14 0-7-10z" fill="#fff"/>`],
 [/blue road sign/i,()=>`<rect x="10" y="10" width="100" height="100" rx="8" fill="#1f4fa3" stroke="#fff" stroke-width="4"/><rect x="38" y="30" width="44" height="60" rx="4" fill="#fff"/>`],
 [/brown road sign/i,()=>`<rect x="6" y="22" width="108" height="76" rx="8" fill="#6b3f1f" stroke="#fff" stroke-width="4"/><path d="M24 82l22-32 14 18 10-12 22 26z" fill="#fff"/>`],
 [/^An? flashing yellow (left-turn )?arrow/i,()=>light("y","arrow")],
 [/^An? steady red arrow/i,()=>light("r","arrow")],
 [/^An? steady yellow (turn )?arrow/i,()=>light("y","arrow")],
 [/^An? green arrow/i,()=>light("g","arrow")],
 [/^An? flashing red light/i,()=>light("r","flash")],
 [/^An? flashing yellow light/i,()=>light("y","flash")],
 [/^An? steady red (traffic )?light/i,()=>light("r")],
 [/^An? steady yellow light/i,()=>light("y")],
 [/traffic lights are dark/i,()=>light("")],
 [/two solid yellow lines/i,()=>road(`<rect x="52" y="0" width="5" height="120" fill="#ffd200"/><rect x="63" y="0" width="5" height="120" fill="#ffd200"/>`)],
 [/solid and broken yellow lines on both sides/i,()=>road(`<rect x="34" y="0" width="5" height="120" fill="#ffd200"/><path d="M44 0v120" stroke="#ffd200" stroke-width="5" stroke-dasharray="14 10"/><path d="M76 0v120" stroke="#ffd200" stroke-width="5" stroke-dasharray="14 10"/><rect x="81" y="0" width="5" height="120" fill="#ffd200"/>`)],
 [/solid yellow line on your side/i,()=>road(`<path d="M54 0v120" stroke="#ffd200" stroke-width="5" stroke-dasharray="14 10"/><rect x="61" y="0" width="5" height="120" fill="#ffd200"/>`)],
 [/broken white lines/i,()=>road(`<path d="M40 0v120M80 0v120" stroke="#fff" stroke-width="5" stroke-dasharray="14 12"/>`)]
];
window.signPic=function(stem){try{if(!stem)return "";for(const [re,f] of P)if(re.test(stem))return `<div class="signpic">${W(f())}</div>`}catch(_){}return ""};
})();
