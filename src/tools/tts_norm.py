"""Turn a fact's question and answer into plain spoken English for the recorded-audio files."""
import re

WORDS = {"NOT": "not", "AND": "and", "OR": "or", "EXCEPT": "except", "ONLY": "only", "ALL": "all", "LAST": "last",
         "REVOKE": "revoke", "DONOR": "donor", "SIMPLE": "simple", "SEP": "sep", "SALT": "salt", "ABLE": "able",
         "SHOP": "shop", "BIG": "big", "CAP": "cap", "PIN": "pin", "LIFO": "life-oh", "FIFO": "fife-oh",
         "MACRS": "makers", "FBAR": "F bar", "FICA": "fie-ka", "FUTA": "few-ta", "FATCA": "fat-ka", "REIT": "reet",
         "UNICAP": "uni-cap", "COGS": "cogs", "EBITDA": "ee-bit-dah", "INT": "int", "DIV": "div", "MISC": "misk",
         "ITIN": "I-tin", "PTIN": "P-tin", "ATIN": "A-tin", "EFIN": "E-fin", "ETIN": "E-tin", "II": "two",
         "MFJ": "married filing jointly", "MFS": "married filing separately", "HOH": "head of household",
         "QSS": "qualifying surviving spouse", "MAGI": "modified A G I", "FMV": "fair market value",
         "SS": "Social Security", "PATH": "path", "NII": "net investment income", "COD": "cancellation of debt"}
FORM3 = {"401", "403", "457", "529", "501", "230", "990", "941", "940", "944", "706", "709", "433", "872", "656", "668", "843", "982"}
PREFIX = re.compile(r"(?:Forms?|[Ss]ections?|Schedules?|Publications?|Pub\.?|Circular|Notice|Letter|and|or|,)\s*$")


O = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen",
     "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
T = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]


def numwords(n):  # 126000 -> "one hundred twenty-six thousand" (same wording as the app's phone voice)
    n = int(n)
    if n == 0:
        return "zero"
    def h(x):
        r = []
        if x >= 100:
            r.append(O[x // 100] + " hundred"); x %= 100
        if x >= 20:
            r.append(T[x // 10] + ("-" + O[x % 10] if x % 10 else ""))
        elif x:
            r.append(O[x])
        return " ".join(r)
    out = []
    for v, w in ((10 ** 12, "trillion"), (10 ** 9, "billion"), (10 ** 6, "million"), (1000, "thousand")):
        if n >= v:
            out.append(h(n // v) + " " + w); n %= v
    if n:
        out.append(h(n))
    return " ".join(out)


BIG = {"k": "thousand", "K": "thousand", "m": "million", "M": "million", "b": "billion", "B": "billion"}


def money(t):  # "$79,000" -> "seventy-nine thousand dollars", "$1.5 million" -> "1.5 million dollars", "$12.50" -> "twelve dollars and fifty cents"
    t = re.sub(r"\$(\d+(?:\.\d+)?)\s?(trillion|billion|million|thousand|[KkMmBb])\b",
               lambda m: m.group(1) + " " + BIG.get(m.group(2), m.group(2)) + " dollars", t)
    def dol(m):
        v = int(m.group(1).replace(",", ""))
        w = numwords(v) + (" dollar" if v == 1 else " dollars")
        c = m.group(2)
        if c and int(c):
            w = (w + " and " if v else "") + numwords(int(c)) + (" cent" if int(c) == 1 else " cents")
        return w
    return re.sub(r"\$(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{2}))?(?![\d.]*\d)", dol, t)


def pair(n):  # 1040 -> "10 40", 8606 -> "86 oh 6", 5500 -> "55 hundred", 709 -> "7 oh 9"
    a, b = n[:-2], n[-2:]
    if b == "00":
        return a + " hundred"
    return a + " " + ("oh " + b[1] if b[0] == "0" else b)


def numbers(t):
    def four(m):
        n, before = m.group(0), t[:m.start()]
        formy = re.search(r"(?:Forms?|[Ss]ections?|Schedules?|Publications?|Pub\.?|Circular)\s*$", before)
        if 1950 <= int(n) <= 2060 and not formy:
            return n
        return pair(n)

    def three(m):
        n, before = m.group(0), t[:m.start()]
        after = t[m.end():]
        unit = re.match(r"\s*(?:days?|hours?|miles?|months?|years?|payments?|weeks?|percent|full|or under|to \d)", after)
        if (n in FORM3 and not unit) or re.search(r"(?:Forms?|[Ss]ections?|Publications?|Pub\.?|Circular|Letter)\s*$", before):
            return pair(n)
        return n
    t = re.sub(r"(?<![\d$,.])\d{4}(?!\d|,\d|%|\.\d)", four, t)
    return re.sub(r"(?<![\d$,.])\d{3}(?!\d|,\d|%|\.\d)", three, t)


def notice(m):  # CP504 -> "C P 5 oh 4", CP2000 -> "C P 2000", CP53E -> "C P 53 E", LT11 -> "L T 11"
    n = m.group(2)
    if len(n) == 3 and n[1] == "0":
        n = n[0] + " oh " + n[2]
    return " ".join(m.group(1)) + " " + n + (" " + m.group(3) if m.group(3) else "")


def spoken(t):
    t = t.replace("U.S.", "U S").replace("Rev. Proc.", "Revenue Procedure").replace("Rev. Rul.", "Revenue Ruling")
    t = re.sub(r"\bReg\.", "Regulation", t)
    t = re.sub(r"\bPub\.", "Publication", t)
    t = re.sub(r"e\.g\.,?", "for example,", t)
    t = re.sub(r"i\.e\.,?", "that is,", t)
    t = re.sub(r"\bvs\.?(?=\s)", "versus", t)
    t = t.replace("§§", "sections ").replace("§", "section ")
    t = re.sub(r"\$(\d[\d,.]*)\s*[–-]\s*\$", r"$\1 to $", t)
    t = money(t)
    t = re.sub(r"(dollars?|cents?|thousand|million|billion)\s*[–—-]\s*", r"\1 to ", t)
    t = re.sub(r"(\d%?)\s*–\s*(\d)", r"\1 to \2", t)
    t = t.replace("–", ", ").replace("—", ", ").replace("…", ".")
    t = t.replace("≥", " at least ").replace("≤", " at most ").replace("→", " then ").replace("×", " times ")
    t = t.replace("÷", " divided by ").replace("−", " minus ").replace("+", " plus ").replace("&", " and ")
    t = t.replace("=", " equals ").replace("<", " less than ").replace(">", " more than ").replace("¢", " cents")
    t = re.sub(r"(\d)½", r"\1 and a half", t).replace("½", "one half").replace("⅔", "two thirds")
    t = re.sub(r"\b1/3\b", "one third", t)
    t = re.sub(r"\b1/6\b", "one sixth", t)
    t = re.sub(r"\bSS-(\d)", r"S S \1", t)                                                      # Form SS-4, SS-8 (not Social Security)
    t = re.sub(r"\b(CP|LT)(\d+)([A-Z]?)\b", notice, t)                                          # notices: CP2000, CP504, LT11
    t = re.sub(r"\bQSub", "Q sub", t).replace("MeF", "M E F")
    t = re.sub(r"(\d{3})\(([a-z])\)", lambda m: pair(m.group(1)) + " " + m.group(2), t)        # 401(k)
    t = re.sub(r"\bK-12\b", "K through 12", t)
    t = re.sub(r"\b((?:19|20)\d\d)-(\d{1,2})\b", r"\1 dash \2", t)                              # Rev. Proc. 2014-7
    # form names such as W-2, 1099-NEC, K-1, SSA-1099: drop the hyphens so each piece is read on its own
    t = re.sub(r"\b[A-Z0-9]+(?:-[A-Z0-9]+)+\b", lambda m: m.group(0).replace("-", " ") if re.search(r"\d", m.group(0)) else m.group(0), t)
    t = re.sub(r"(?<=\d)([A-Z])\b", r" \1", t)                                                   # W 2G -> W 2 G
    t = numbers(t)
    t = t.replace("/", " or ")
    t = re.sub(r"\b(PTIN|EFIN|ETIN)s\b", lambda m: WORDS[m.group(1)] + "s", t)
    t = re.sub(r"\b([A-Z]{2,6})s\b", lambda m: " ".join(m.group(1)) + "s", t)                    # IRAs -> I R As
    t = re.sub(r"\b[A-Z]{2,7}\b", lambda m: WORDS.get(m.group(0), " ".join(m.group(0))), t)      # IRS -> I R S
    t = re.sub(r"[()“”\"\[\]]", ", ", t)
    t = re.sub(r"\s+", " ", t).replace(" ,", ",").replace(" .", ".")
    t = re.sub(r",\s*,", ",", t)
    t = re.sub(r",\s*([.?;:])", r"\1", t)
    return t.strip(" ,")


def question(f):
    if f.endswith("?"):
        return spoken(f)
    if re.match(r"^(?:FinCEN )?(Form|Schedule) [A-Za-z0-9-]+$", f):
        return "What is " + spoken(f) + " used for?"
    if re.match(r"^[A-Z][A-Z0-9&/ -]{1,7}$", f):
        return "What does " + " ".join(re.sub(r"[^A-Z0-9]", "", f)) + " mean?"
    return spoken(f.replace(":", ",")) + "?"


def answer(b):
    if len(b) > 480:
        cut = b[:480]
        k = max(cut.rfind(". "), cut.rfind("; "))
        b = cut[:k + 1] if k > 120 else cut
    s = spoken(b)
    return s if s[-1:] in ".?!" else s + "."


if __name__ == "__main__":
    import json, random, sys
    d = json.load(open(sys.argv[1]))
    random.seed(4)
    for x in random.sample(d, 22):
        print("Q:", question(x["f"]), "\nA:", answer(x["b"]), "\n")
