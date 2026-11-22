import time,onnxruntime as ort
from kokoro_onnx import Kokoro
txt="Failure to file penalty. Five percent of the unpaid tax for each month or part of a month, up to twenty-five percent."
for name,kw in [("seq2",dict(intra=2,inter=1,mode=ort.ExecutionMode.ORT_SEQUENTIAL)),("par",dict(intra=2,inter=2,mode=ort.ExecutionMode.ORT_PARALLEL)),("one",dict(intra=1,inter=1,mode=ort.ExecutionMode.ORT_SEQUENTIAL))]:
    so=ort.SessionOptions();so.intra_op_num_threads=kw["intra"];so.inter_op_num_threads=kw["inter"];so.execution_mode=kw["mode"];so.graph_optimization_level=ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    k=Kokoro.from_session(ort.InferenceSession("kokoro-v1.0.int8.onnx",so,providers=["CPUExecutionProvider"]),"voices-v1.0.bin")
    k.create("Warm up.",voice="af_heart",lang="en-us")
    t=time.time();s,sr=k.create(txt,voice="af_heart",speed=1.0,lang="en-us");d=len(s)/sr
    print(name,"rtf",round((time.time()-t)/d,2))
