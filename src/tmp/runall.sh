#!/bin/sh
cd /home/claude/ea-app/tmp
for t in t214 t216 t220 t221 t222 t223 t224; do echo "=== $t"; timeout 420 node $t.js 2>&1 | grep -v "^termout" | tail -25; done
echo "=== ALL DONE"
