#!/bin/sh
# Rebuild the working folders in a new session from the repository.
# usage: sh restore.sh [repo folder] [sources folder]
set -e
R=${1:-/home/claude/ea-exam-app}; A=${2:-/home/claude/ea-app}
[ -d "$R/src" ] || git clone https://github.com/stumbras/ea-exam-app "$R"
mkdir -p "$A/pwa" "$A/tmp/web"
cp -r "$R/src/." "$A/"
(cd "$R" && tar cf - --exclude=.git --exclude=./src .) | (cd "$A/pwa" && tar xf -)
if [ "$A" = /home/claude/ea-app ]; then cp "$A"/tools/tts_*.py /home/claude/ 2>/dev/null || true; fi
if [ -d "$R/.git" ]; then C=$(cd "$R" && git log --format=%h --grep='^Version 164' | tail -1); [ -n "$C" ] && (cd "$R" && git show "$C:index.html" > "$A/tmp/old164.html") || true; fi
V=$(python3 -c "import json;print(json.load(open('$A/pwa/version.json'))['v'])")
cd "$A" && python3 build.py "$V" >/dev/null
if cmp -s "$A/pwa/index.html" "$R/index.html"; then echo "RESTORED: sources in $A, build is identical to the published app ($V)"; else echo "RESTORED, but the build differs from the published index.html: check before shipping"; fi
