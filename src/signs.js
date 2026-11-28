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

const Y="#ffd200",K="#111",FG="#c4e000",OR="#ff7a00";
const D=(c,in_)=>dia(c,in_);
const ln=(d,w)=>`<path d="${d}" fill="none" stroke="${K}" stroke-width="${w||7}" stroke-linecap="round" stroke-linejoin="round"/>`;
const ar=(d)=>`<path d="${d}" fill="${K}"/>`;
const proh=in_=>`<rect x="10" y="10" width="100" height="100" rx="6" fill="#fff" stroke="${K}" stroke-width="3"/>${in_}<circle cx="60" cy="60" r="38" fill="none" stroke="#c8102e" stroke-width="8"/><path d="M33 33L87 87" stroke="#c8102e" stroke-width="8"/>`;
const man=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s||1})" fill="${K}" stroke="${K}"><circle cx="0" cy="-16" r="5"/><path d="M0 -10L-2 6L-8 20M-2 6L6 20M-1 -6L-9 2M-1 -6L8 -1" fill="none" stroke-width="4" stroke-linecap="round"/></g>`;
const SG={
 dne:()=>`<circle cx="60" cy="60" r="54" fill="#c8102e" stroke="#fff" stroke-width="4"/><rect x="22" y="52" width="76" height="16" rx="2" fill="#fff"/>`,
 noleft:()=>proh(ln("M74 92V56H46",9)+ar("M48 42L30 56L48 70Z")),
 noright:()=>proh(ln("M46 92V56H74",9)+ar("M72 42L90 56L72 70Z")),
 nou:()=>proh(ln("M74 92V52a14 14 0 0 0-28 0V76",9)+ar("M34 74L46 92L58 74Z")),
 keepright:()=>`<rect x="20" y="6" width="80" height="108" rx="6" fill="#fff" stroke="${K}" stroke-width="3"/><ellipse cx="50" cy="74" rx="12" ry="20" fill="${K}"/>`+ln("M54 104C80 90 82 60 70 36",7)+ar("M60 38L72 20L82 40Z"),
 merge:()=>D(Y,ln("M54 100V20",8)+ln("M80 92C78 70 60 64 56 54",7)),
 laneends:()=>D(Y,ln("M46 100V22",6)+ln("M80 100V70L62 44V22",6)),
 divbegins:()=>D(Y,ln("M60 98V74",6)+ln("M60 74C44 64 44 50 44 24",6)+ln("M60 74C76 64 76 50 76 24",6)+`<path d="M60 70C54 60 54 48 54 26H66C66 48 66 60 60 70Z" fill="${K}"/>`),
 divends:()=>D(Y,ln("M60 24V48",6)+ln("M60 48C44 58 44 72 44 98",6)+ln("M60 48C76 58 76 72 76 98",6)+`<path d="M60 52C54 62 54 74 54 96H66C66 74 66 62 60 52Z" fill="${K}"/>`),
 twoway:()=>D(Y,ln("M48 98V40",7)+ar("M36 44L48 24L60 44Z")+ln("M72 22V80",7)+ar("M60 76L72 96L84 76Z")),
 curveright:()=>D(Y,ln("M48 100V66C48 46 60 40 70 36",8)+ar("M62 26L84 30L72 48Z")),
 sharpright:()=>D(Y,ln("M50 100V48H72",8)+ar("M70 34L90 48L70 62Z")),
 winding:()=>D(Y,ln("M54 100C54 86 70 82 70 70S50 56 50 46S62 34 62 32",7)+ar("M52 34L64 18L74 36Z")),
 cross:()=>D(Y,ln("M60 100V20",9)+ln("M24 60H96",9)),
 tint:()=>D(Y,ln("M60 100V48",9)+ln("M28 46H92",9)),
 sideroad:()=>D(Y,ln("M54 100V20",9)+ln("M54 56L88 42",8)),
 yint:()=>D(Y,ln("M60 100V64",9)+ln("M60 64L38 30",9)+ln("M60 64L82 30",9)),
 signalahead:()=>D(Y,`<rect x="47" y="26" width="26" height="68" rx="6" fill="${K}"/><circle cx="60" cy="40" r="8" fill="#e5322d"/><circle cx="60" cy="60" r="8" fill="${Y}"/><circle cx="60" cy="80" r="8" fill="#1fa34a"/>`),
 stopahead:()=>D(Y,ln("M60 100V68",7)+ar("M50 72L60 56L70 72Z")+`<g transform="translate(60 40) scale(.36) translate(-60 -60)">${oct("#c8102e")}</g>`),
 yieldahead:()=>D(Y,ln("M60 100V68",7)+ar("M50 72L60 56L70 72Z")+`<polygon points="40,26 80,26 60,56" fill="#fff" stroke="#c8102e" stroke-width="7" stroke-linejoin="round"/>`),
 slippery:()=>D(Y,`<rect x="44" y="30" width="32" height="24" rx="6" fill="${K}"/><circle cx="48" cy="56" r="4" fill="${K}"/><circle cx="72" cy="56" r="4" fill="${K}"/>`+ln("M48 64C42 72 54 78 46 88",4)+ln("M72 64C66 72 78 78 70 88",4)),
 ped:()=>D(FG,man(60,64,1.5)),
 school:()=>`<polygon points="60,6 112,46 112,114 8,114 8,46" fill="${FG}" stroke="${K}" stroke-width="4"/>${man(46,86,1.2)}${man(74,90,1)}`,
 bike:()=>D(Y,`<circle cx="42" cy="72" r="12" fill="none" stroke="${K}" stroke-width="5"/><circle cx="78" cy="72" r="12" fill="none" stroke="${K}" stroke-width="5"/>`+ln("M42 72L56 52H72L78 72M56 52L64 72H42M70 46H76",4)+`<circle cx="58" cy="38" r="5" fill="${K}"/>`),
 hill:()=>D(Y,`<path d="M26 82L94 96V100H26Z" fill="${K}"/><rect x="36" y="56" width="34" height="18" rx="2" fill="${K}" transform="rotate(10 53 65)"/><rect x="68" y="62" width="14" height="14" rx="2" fill="${K}" transform="rotate(10 75 69)"/>`),
 narrows:()=>D(Y,ln("M40 100V76L50 56V22",6)+ln("M80 100V76L70 56V22",6)),
 hospital:()=>`<rect x="10" y="10" width="100" height="100" rx="8" fill="#1f4fa3" stroke="#fff" stroke-width="4"/><text x="60" y="84" text-anchor="middle" font-family="Arial" font-weight="800" font-size="70" fill="#fff">H</text>`,
 flagger:()=>D(OR,man(54,66,1.4)+ln("M66 52L80 34",4)+`<rect x="78" y="26" width="14" height="10" fill="#c8102e"/>`),
 workers:()=>D(OR,man(52,64,1.4)+ln("M64 52L80 82",4)+`<path d="M76 80L90 88L82 94Z" fill="${K}"/><path d="M30 92H92" stroke="${K}" stroke-width="4"/>`)
};
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
window.signPic=function(stem){try{if(!stem)return "";const sk=window.SIGNQ&&SIGNQ[stem];if(sk&&SG[sk])return `<div class="signpic">${W(SG[sk]())}</div>`;for(const [re,f] of P)if(re.test(stem))return `<div class="signpic">${W(f())}</div>`}catch(_){}return ""};
})();
