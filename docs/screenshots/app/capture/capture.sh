#!/usr/bin/env bash
# Rebuild the in-page app screenshots used by the landing page.
#
# What it does, without touching the real app or any shared backend:
#   1. copies the app into a temp dir and replaces src/api/index.ts there with
#      api.stub.ts (sample greetings, no Firebase reads or writes);
#   2. downloads N photos read-only (HTTP GET) from the /test event's image
#      folder into that copy's public/sample-img/;
#   3. runs a production `yarn build` of the copy and serves it like GitHub
#      Pages (serve.py);
#   4. opens headless Chrome with every non-localhost host unresolvable and
#      every non-local request failed (capture.js), then screenshots the
#      greeting form, the live wall and the lottery;
#   5. converts the PNGs to compressed WebP in src/Landing/screenshots/.
#
# Requires Node 13 (node-sass), python3 with Pillow, and Chrome.
# Usage: docs/screenshots/app/capture/capture.sh [chrome-binary]
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../.." && pwd)"
CHROME="${1:-/usr/bin/google-chrome}"
APP_PORT="${APP_PORT:-5099}"
DEBUG_PORT="${DEBUG_PORT:-9333}"
IMG_COUNT="${IMG_COUNT:-40}"
# The /test event's config points at this image namespace (see configService.ts).
IMG_PREFIX="chyy/small/"
BUCKET="image.weddi.app"

WORK="$(mktemp -d)"
PIDS=()
cleanup() {
  for pid in "${PIDS[@]}"; do kill "$pid" 2>/dev/null || true; done
  wait 2>/dev/null || true
  rm -rf "$WORK"
}
trap cleanup EXIT

echo "work dir: $WORK"
mkdir -p "$WORK/app" "$WORK/shots" "$WORK/chrome"
cp -R "$REPO/src" "$REPO/public" "$REPO/package.json" "$REPO/tsconfig.json" "$WORK/app/"
ln -s "$REPO/node_modules" "$WORK/app/node_modules"
cp "$HERE/api.stub.ts" "$WORK/app/src/api/index.ts"

# Read-only: list and download photos from the /test event's image folder.
mkdir -p "$WORK/app/public/sample-img"
curl -fsS "https://firebasestorage.googleapis.com/v0/b/$BUCKET/o?prefix=${IMG_PREFIX//\//%2F}&delimiter=%2F" > "$WORK/list.json"
python3 -I - "$WORK/list.json" "$IMG_COUNT" > "$WORK/names.txt" <<'PY'
import json, sys
items = sorted(i['name'] for i in json.load(open(sys.argv[1]))['items'])
for name in items[: int(sys.argv[2])]:
    print(name)
PY
names=()
while read -r obj; do
  file="$(basename "$obj")"
  curl -fsS -o "$WORK/app/public/sample-img/$file" \
    "https://firebasestorage.googleapis.com/v0/b/$BUCKET/o/${obj//\//%2F}?alt=media"
  names+=("'$file'")
done < "$WORK/names.txt"
( IFS=,; echo "export const SAMPLE_IMAGES: string[] = [${names[*]}];" ) > "$WORK/app/src/api/sampleImages.ts"

( cd "$WORK/app" && CI=true yarn build )

python3 -I "$HERE/serve.py" "$WORK/app/build" "$APP_PORT" &
PIDS+=($!)

"$CHROME" --headless=new --disable-extensions --disable-gpu --no-first-run --no-default-browser-check \
  --user-data-dir="$WORK/chrome" --remote-debugging-port="$DEBUG_PORT" \
  --host-resolver-rules="MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1" \
  --lang=en-US --hide-scrollbars about:blank >/dev/null 2>&1 &
PIDS+=($!)

for _ in $(seq 1 50); do
  curl -fsS "http://127.0.0.1:$DEBUG_PORT/json/version" >/dev/null 2>&1 && break
  sleep 0.2
done

node "$HERE/capture.js" "$DEBUG_PORT" "http://127.0.0.1:$APP_PORT" "$WORK/shots"

python3 -I "$HERE/to_webp.py" "$WORK/shots" "$REPO/src/Landing/screenshots"
