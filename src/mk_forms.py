"""Build the real-form viewer assets: pwa/forms/<key>-<n>.webp (page images) and pwa/forms/<key>.json (fields with the IRS's own text).
Source PDFs: /tmp/irsforms/pdf (downloaded from https://www.irs.gov/pub/irs-pdf/). Writes forms_index.js (embedded in the app)."""
import glob, json, os, subprocess, sys, tempfile, shutil
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mk_forms_lib import read
SRC, DST = '/tmp/irsforms/pdf', 'pwa/forms'
os.makedirs(DST, exist_ok=True)
names = json.load(open('/tmp/irsforms/map.json'))      # "Form 1040" -> "f1040"
names['Form 1099-MISC'] = 'f1099msc'; names['Form 1040-SR'] = 'f1040s'
idx = {}
for f in sorted(glob.glob(SRC + '/*.pdf')):
    k = os.path.basename(f)[:-4]
    if open(f, 'rb').read(5) != b'%PDF-':
        continue
    out = f'{DST}/{k}.json'
    if os.path.exists(out):
        j = json.load(open(out)); idx[k] = [j['t'], len(j['p']), len(j['f'])]; continue
    try:
        pages, fields, title = read(f)
    except Exception as e:
        print('SKIP', k, repr(e)[:80], flush=True); continue
    keep, seen = [], set()
    for pi in range(len(pages)):
        labs = tuple(sorted(x[6] for x in fields if x[0] == pi))
        if not labs or (labs in seen and len(labs) > 3):
            continue
        seen.add(labs); keep.append(pi)
    if not keep:
        keep = list(range(min(2, len(pages))))
    keep = keep[:14]
    tmp = tempfile.mkdtemp()
    P = []
    for n, pi in enumerate(keep):
        subprocess.run(['pdftoppm', '-r', '120', '-f', str(pi + 1), '-l', str(pi + 1), '-gray', '-png', '-singlefile', f, f'{tmp}/p'], check=True)
        im = Image.open(f'{tmp}/p.png').convert('L').quantize(4, dither=Image.Dither.NONE)
        im.save(f'{DST}/{k}-{n}.webp', 'WEBP', lossless=True, method=4)
        P.append([im.size[0], im.size[1]])
    shutil.rmtree(tmp)
    F = [[keep.index(x[0]), round(x[1] * 1000), round(x[2] * 1000), round(x[3] * 1000), round(x[4] * 1000), x[5], x[6]] for x in fields if x[0] in keep]
    json.dump({'t': title, 'p': P, 'f': F}, open(out, 'w'), separators=(',', ':'), ensure_ascii=False)
    idx[k] = [title, len(P), len(F)]
    print(k, len(P), len(F), flush=True)
al = {n: k for n, k in names.items() if k in idx}
open('forms_index.js', 'w').write('/* built by mk_forms.py from the PDFs on IRS.gov */\nconst FORMIDX=' + json.dumps(idx, separators=(',', ':'), ensure_ascii=False) + ';\nconst FORMNAME=' + json.dumps(al, separators=(',', ':')) + ';\n')
print('DONE', len(idx), 'forms', flush=True)
