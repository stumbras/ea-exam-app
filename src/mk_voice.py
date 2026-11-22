import os,json
d="pwa/voice";out={}
for v in ["max","nova"]:
    p=f"{d}/{v}";out[v]=sorted(f[:-4] for f in os.listdir(p) if f.endswith(".mp3")) if os.path.isdir(p) else []
open("kids_voice.js","w").write("/* recorded natural-voice clips (Kokoro), by voice: file ids = hash of the spoken text */\nconst KVREC="+json.dumps(out,separators=(",",":"))+";\n")
print({k:len(v) for k,v in out.items()})
