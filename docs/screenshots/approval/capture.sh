#!/usr/bin/env bash
# Isolated mock capture; delegates temp copy/build, read-only photo GETs and cleanup.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
if [[ "$(node -v)" != v13.* ]]; then
  echo "Use Node 13 for this temp-copy screenshot build (node-sass)." >&2
  exit 1
fi
export CAPTURE_SCRIPT="$HERE/capture.js"
export CAPTURE_OUTPUT="$HERE"
export APP_PORT="${APP_PORT:-5101}"
export DEBUG_PORT="${DEBUG_PORT:-9335}"
export IMG_COUNT=16
export CAPTURE_OFFLINE=1
exec bash "$HERE/../app/capture/capture.sh" "${1:-/usr/bin/google-chrome}"
