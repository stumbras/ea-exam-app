"""Copy finished recordings into the app folder and write audio/meta.json (fact id -> second where the answer starts)."""
import glob, json, os, shutil
SRC, DST = "/home/claude/tts/out", "pwa/audio"
os.makedirs(DST, exist_ok=True)
meta = {}
# Only parts whose facts are ALL recorded are packed: with the recorded voice the app plays recorded facts only, so a part that is
# half recorded would silently leave the other half out of "hear every fact".
_facts = json.load(open("/home/claude/tts/facts_raw.json"))
_done = lambda x: os.path.exists(f"{SRC}/{x['id']}.mp3") and os.path.exists(f"{SRC}/{x['id']}.json")
_parts = sorted(set(x["p"] for x in _facts))
_full = [p for p in _parts if all(_done(x) for x in _facts if x["p"] == p)]
_ok = set(x["id"] for x in _facts if x["p"] in _full)
print("complete parts:", _full, "| incomplete:", {p: sum(1 for x in _facts if x["p"] == p and not _done(x)) for p in _parts if p not in _full})
for j in sorted(glob.glob(SRC + "/*.json")):
    i = os.path.basename(j)[:-5]
    mp3 = f"{SRC}/{i}.mp3"
    if not os.path.exists(mp3) or i not in _ok:
        continue
    meta[i] = [json.load(open(j))["a"], os.path.getsize(mp3)]  # second where the answer starts, file size (used as the file's version)
    if not os.path.exists(f"{DST}/{i}.mp3") or os.path.getsize(f"{DST}/{i}.mp3") != os.path.getsize(mp3):
        shutil.copyfile(mp3, f"{DST}/{i}.mp3")
json.dump(meta, open(DST + "/meta.json", "w"), separators=(",", ":"))
print(len(meta), "recordings,", round(sum(os.path.getsize(f"{DST}/{k}.mp3") for k in meta) / 1048576, 1), "MB")
