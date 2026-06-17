#!/bin/bash
echo "=== Backend Engineer Home ==="
ls -la /home/agent-backend-engineer/ 2>/dev/null || echo "no home"
echo "=== Shared Dir ==="
ls -la /home/team/shared/
echo "=== Checking team-db ==="
team-db "SELECT name FROM sqlite_master WHERE type='table'"
echo "=== Done ==="