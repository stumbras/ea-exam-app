import time,sys,soundfile as sf
from kokoro_onnx import Kokoro
t=time.time();k=Kokoro("kokoro-v1.0.int8.onnx","voices-v1.0.bin");print("load",round(time.time()-t,1))
txt="Failure to file penalty. Five percent of the unpaid tax for each month or part of a month, up to twenty-five percent."
for v in ["af_heart","am_michael"]:
    t=time.time();s,sr=k.create(txt,voice=v,speed=1.0,lang="en-us");d=len(s)/sr
    print(v,"audio",round(d,1),"s in",round(time.time()-t,1),"s  rtf",round((time.time()-t)/d,2),sr)
    sf.write(f"test_{v}.wav",s,sr)
