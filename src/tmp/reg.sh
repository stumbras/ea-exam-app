#!/bin/sh
cd /home/claude/ea-app
: > /tmp/reg.log
for t in t650 t641 t642 t645 t510 t610 t612 t620 t520 t313 t345 t351 t401 t410 t380 t370 t362 t332 t311 t390 t310; do out=$(timeout 200 node tmp/$t.js 2>&1); p=$(echo "$out" | grep -c "^PASS"); f=$(echo "$out" | grep -c "FAIL"); e=$(echo "$out" | grep -i "^errors\|pageerror" | tail -1 | cut -c1-150); echo "$t pass=$p fail=$f $e" >> /tmp/reg.log; [ "$f" != "0" ] && echo "$out" | grep -B2 "FAIL" | cut -c1-260 | head -12 >> /tmp/reg.log; done
echo DONE >> /tmp/reg.log
