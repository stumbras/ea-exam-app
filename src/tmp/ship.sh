#!/bin/sh
# usage: ship.sh "Version NN" "commit message"  (after build + tests)
set -e
cd /home/claude/ea-app
python3 - <<'PY'
s=open('ea-exam-drill.html').read().replace('<title>EA Exam Drill</title>','<title>EA Exam APP</title>')
open('tmp/web/index.html','w').write(s)
PY
# sources and HISTORY.md travel with the app, so any new session can rebuild and continue (see HISTORY.md)
python3 /home/claude/ea-app/tmp/sync_src.py "$1" "$2"
rm -rf /home/claude/ea-exam-app/src
cd /home/claude/ea-exam-app && cp -r /home/claude/ea-app/pwa/. . && git add -A
git -c user.name="Linas Kerbelis" -c user.email="stumbras@users.noreply.github.com" commit -qm "$1: $2

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_017Y7zWT8MhmMBQSpWCTPuco"
git -c push.negotiate=true push -q origin main && git -c push.negotiate=true push -q origin main:gh-pages
# branch "site" = the app only (no src/, HISTORY.md, README.md), for web hosts such as Cloudflare Pages
sh /home/claude/ea-app/tmp/push_site.sh "$1"
git ls-remote origin | head -3
