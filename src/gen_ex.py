import json,glob
r=json.load(open("todo.json"));out=["// More explanations, generated from ex/*.txt"];n=0;seen=set()
for f in sorted(glob.glob("ex/*.txt")):
    for line in open(f):
        line=line.rstrip("\n")
        if not line.strip():continue
        i,t=line.split("|",1);i=int(i);assert i not in seen,(f,i);seen.add(i);x=r[i]
        out.append("EX(%d,%s,%s);"%(x["p"],json.dumps(x["f"],ensure_ascii=False),json.dumps(t.strip(),ensure_ascii=False)));n+=1
open("bank_explain3.js","w").write("\n".join(out)+"\n");print("generated",n,"remaining",len(r)-n)
