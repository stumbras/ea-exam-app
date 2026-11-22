#!/bin/sh
# usage: push_site.sh "Version NN"   Publishes the app-only tree of main's HEAD to the branch "site".
# The working sources (src/), HISTORY.md and README.md stay on main, so a web host that serves "site" never serves
# them. Each push adds one commit on top of the last one (ordinary push, never forced). main and gh-pages are untouched.
set -e
cd /home/claude/ea-exam-app
tree=$(git ls-tree HEAD | grep -v -P '\t(src|HISTORY\.md|README\.md)$' | git mktree)
git fetch -q origin site 2>/dev/null && git update-ref refs/heads/site FETCH_HEAD || true
if git rev-parse -q --verify site >/dev/null; then par="-p site"; else par=""; fi
c=$(git -c user.name="Solving Life LLC" -c user.email="stumbras@users.noreply.github.com" commit-tree "$tree" $par -m "$1 (app only)")
git update-ref refs/heads/site "$c"
git -c push.negotiate=true push -q origin site:site
