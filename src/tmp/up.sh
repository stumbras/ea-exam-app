#!/bin/sh
curl -s -o /dev/null http://localhost:8765/ea-exam-app/ 2>/dev/null || { mkdir -p /tmp/srv; ln -sfn /home/claude/ea-app/pwa /tmp/srv/ea-exam-app; cd /tmp/srv && setsid nohup python3 -m http.server 8765 >/tmp/srv.log 2>&1 & sleep 1; }
