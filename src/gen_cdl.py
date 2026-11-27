# Builds cdl_bank.js from free/cdl/cdl.txt. Rows: domain|question|right|wrong|wrong|wrong|explanation|check
# "check" is a regular expression that tmp/cdlcheck.py must find in the official handbook text; it is not shipped.
import json
J=lambda x:json.dumps(x,ensure_ascii=False)
out=["/* CDL permit prep (part 14). Source: Texas Commercial Motor Vehicle Drivers Handbook DL-7C (2026 file), which carries the national model CDL manual text. Made by gen_cdl.py */"]
n=0
for ln in open("free/cdl/cdl.txt",encoding="utf-8"):
    r=ln.rstrip("\n").split("|")
    if len(r)<8: continue
    d,q,right,w1,w2,w3,ex=r[:7]
    out.append(f"Q(14,{d},{1 if int(d)<4 else 2},{J(q)},{J(right)},{J([w1,w2,w3])},{J(ex)});")
    out.append(f"F(14,{d},{J(q)},{J(right+'. '+ex)});"); n+=1
open("cdl_bank.js","w",encoding="utf-8").write("\n".join(out)+"\n"); print("cdl",n)
