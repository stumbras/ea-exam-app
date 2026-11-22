#!/bin/sh
# Run before every release: bias guard + main regression tests
cd "$(dirname "$0")" && node t_bias_guard.js && for t in t140 t96 t170 t130 t195; do echo "== $t"; timeout 300 node $t.js 2>&1 | tail -3; done
node t197.js 2>&1 | grep -E "errors|overflow"
node t199.js 2>&1 | grep -E "errors|overflow"
node t201.js 2>&1 | tail -1
node t202.js 2>&1 | tail -1
node t207.js 2>&1 | grep -E "errors|overflow"
node t208.js 2>&1 | grep -E "errors|overflow"
node t209.js 2>&1 | grep -E "errors|overflow"
