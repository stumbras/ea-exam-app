"""Read an IRS fillable PDF: its fields (page, box, type) and the IRS's own accessibility text for each field."""
import re, html
from pypdf import PdfReader

def up(o, k):
    while o is not None:
        if k in o:
            return o[k]
        o = o.get('/Parent'); o = o.get_object() if o is not None else None
    return None

def speak_map(r):
    try:
        x = r.trailer['/Root']['/AcroForm'].get('/XFA')
        names = [str(x[i]) for i in range(0, len(x), 2)]
        tpl = x[names.index('template') * 2 + 1].get_object().get_data().decode('utf8', 'replace')
    except Exception:
        return {}
    out = {}
    for m in re.finditer(r'<(?:field|exclGroup)\b[^>]*?\bname="([^"]+)"', tpl):
        seg = tpl[m.end():m.end() + 6000]
        e = re.search(r'</field\s*>', seg)
        seg = seg[:e.start()] if e else seg
        s = re.search(r'<speak[^>]*>([\s\S]*?)</speak', seg) or re.search(r'<toolTip[^>]*>([\s\S]*?)</toolTip', seg)
        if s and m.group(1) not in out:
            out[m.group(1)] = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s.group(1)))).strip()
    return out

def read(path):
    r = PdfReader(path)
    sp = speak_map(r)
    pages, fields = [], []
    for pi, pg in enumerate(r.pages):
        b = pg.cropbox; W, H, x0, y0 = float(b.width), float(b.height), float(b.left), float(b.bottom)
        pages.append((W, H))
        an = pg.get('/Annots'); an = an.get_object() if an is not None else []
        for a in an:
            a = a.get_object()
            if a.get('/Subtype') != '/Widget':
                continue
            ft = up(a, '/FT')
            if ft not in ('/Tx', '/Btn', '/Ch'):
                continue
            rc = [float(v) for v in a['/Rect']]
            name = str(up(a, '/T') or '')
            leaf = re.sub(r'\[\d+\]$', '', name)
            label = sp.get(leaf, '') or str(up(a, '/TU') or '')
            if label == 'None':
                label = ''
            fields.append((pi, (min(rc[0], rc[2]) - x0) / W, 1 - (max(rc[1], rc[3]) - y0) / H, abs(rc[2] - rc[0]) / W, abs(rc[3] - rc[1]) / H, 1 if ft == '/Btn' else 0, label))
    title = ''
    try:
        title = str(r.metadata.title or '')
    except Exception:
        pass
    return pages, fields, title
