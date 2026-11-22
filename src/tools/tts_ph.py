from kokoro_onnx import Kokoro
k=Kokoro("kokoro-v1.0.int8.onnx","voices-v1.0.bin")
for t in ["Form 10 40","Form 1040","What is Form 10 40 N R used for?","Form 21 oh 6","Form 7 oh 9","5 29 plan","Form 10 99 int","Schedule 88 12","W 2","$15,750","4 oh 1 k","I R S","F bar","fie-ka","section 1 21","K 1"]:
    print(t,"=>",k.tokenizer.phonemize(t,"en-us"))
