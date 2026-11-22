"""Record facts as MP3 files: question, a pause to think, the answer. Resumable; run several workers in parallel.
usage: python3 -I tts_gen.py <part> <worker index> <worker count> [limit]"""
import json, os, subprocess, sys, time
import numpy as np
import onnxruntime as ort
from kokoro_onnx import Kokoro

sys.path.insert(0, "/home/claude")
from tts_norm import question, answer

BASE = "/home/claude/tts"
OUT = BASE + "/out"
VOICE = "af_heart"
GAP, TAIL, LEAD = 2.0, 0.7, 0.15
part, wk, wn = int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3])
limit = int(sys.argv[4]) if len(sys.argv) > 4 else 10 ** 9
os.makedirs(OUT, exist_ok=True)
facts = [x for x in json.load(open(BASE + "/facts_raw.json")) if x["p"] == part]
def stale(x):  # not recorded yet, or the spoken wording has changed since it was recorded
    j = f"{OUT}/{x['id']}.json"
    if not os.path.exists(j):
        return True
    m = json.load(open(j))
    return m.get("q") != question(x["f"]) or m.get("t") != answer(x["b"])
todo = [x for i, x in enumerate(facts) if i % wn == wk and stale(x)][:limit]
so = ort.SessionOptions()
so.intra_op_num_threads = 1
so.inter_op_num_threads = 1
k = Kokoro.from_session(ort.InferenceSession(BASE + "/kokoro-v1.0.int8.onnx", so, providers=["CPUExecutionProvider"]), BASE + "/voices-v1.0.bin")
t0, made = time.time(), 0.0
for n, x in enumerate(todo):
    q, a = question(x["f"]), answer(x["b"])
    try:
        sq, sr = k.create(q, voice=VOICE, speed=1.0, lang="en-us")
        sa, _ = k.create(a, voice=VOICE, speed=1.0, lang="en-us")
    except Exception as e:  # leave it out; the app falls back to the phone voice for this fact
        print("FAIL", x["id"], repr(e)[:120], flush=True)
        continue
    z = lambda s: np.zeros(int(sr * s), dtype=np.float32)
    wav = np.concatenate([z(LEAD), sq, z(GAP), sa, z(TAIL)]).astype(np.float32)
    wav = np.clip(wav / max(1e-6, float(np.max(np.abs(wav)))) * 0.89, -1, 1)
    pcm = (wav * 32767).astype("<i2").tobytes()
    tmp = f"{OUT}/{x['id']}.tmp.mp3"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(sr), "-ac", "1", "-i", "-",
                    "-codec:a", "libmp3lame", "-b:a", "24k", "-ar", "24000", tmp], input=pcm, check=True)
    os.replace(tmp, f"{OUT}/{x['id']}.mp3")
    json.dump({"a": round(LEAD + len(sq) / sr + GAP - 0.3, 1), "d": round(len(wav) / sr, 1), "q": q, "t": a}, open(f"{OUT}/{x['id']}.json", "w"))
    made += len(wav) / sr
    if n % 10 == 0:
        print(f"w{wk} {n + 1}/{len(todo)} audio {made / 60:.1f} min in {(time.time() - t0) / 60:.1f} min", flush=True)
print(f"w{wk} done {len(todo)} files, {made / 60:.1f} min of audio, {(time.time() - t0) / 60:.1f} min", flush=True)
