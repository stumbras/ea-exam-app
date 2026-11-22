/* Apply the balanced answer choices to the bank: right answer kept (or trimmed to its core), wrong options rewritten.
   Entry forms: id:[w1,w2,w3]  or  id:{c:"core right answer",w:[...],x:"detail moved to the explanation"} */
(function(){const parts=["BAL1","BAL1b","BAL2","BAL2b","BAL3","BAL3b","BAL4","BAL4b","BAL5","BAL5b","BAL6","BAL6b","BAL7"],B={};
  parts.forEach(n=>{try{const o=eval("typeof "+n+"!=='undefined'?"+n+":null");if(o)Object.assign(B,o)}catch(e){}});
  BANK.forEach(i=>{const w=B[i.id];if(!w||i.t!=="q")return;const v=Array.isArray(w)?{w}:w;const c=v.c||i.opts[i.ans];
    i.opts=[c,...v.w];i.ans=0;if(v.x)i.ex=v.x+" "+(i.ex||"");i.bal=1})})();
