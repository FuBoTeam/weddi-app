#!/usr/bin/env bash
# Rebuild the in-page app screenshots used by the landing page.
#
# What it does, without touching the real app or any shared backend:
#   1. copies the app into a temp dir and replaces src/api/index.ts there with
#      api.stub.ts (sample greetings, no Firebase reads or writes);
#   2. downloads N photos read-only (HTTP GET) from the /test event's image
#      folder, or reuses checked-in screenshot crops with CAPTURE_OFFLINE=1;
#   3. runs a production `yarn build` of the copy and serves it like GitHub
#      Pages (serve.py);
#   4. opens headless Chrome with every non-localhost host unresolvable and
#      every non-local request failed (capture.js), then screenshots the
#      greeting form, the live wall and the lottery;
#   5. converts the PNGs to compressed WebP in src/Landing/screenshots/.
#
# The temp copy also gets an inert provider and analytics calls, so Firebase
# is never initialized. CAPTURE_SCRIPT and CAPTURE_OUTPUT select another
# browser check and PNG output folder, as used by the approval capture.
# Requires Node 13 (node-sass), python3 with Pillow, and Chrome.
# Usage: docs/screenshots/app/capture/capture.sh [chrome-binary]
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../.." && pwd)"
CHROME="${1:-/usr/bin/google-chrome}"
APP_PORT="${APP_PORT:-5099}"
DEBUG_PORT="${DEBUG_PORT:-9333}"
IMG_COUNT="${IMG_COUNT:-40}"
NODE_MODULES="${CAPTURE_NODE_MODULES:-$REPO/node_modules}"
CAPTURE_SCRIPT="${CAPTURE_SCRIPT:-$HERE/capture.js}"
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
ln -s "$NODE_MODULES" "$WORK/app/node_modules"
cp "$HERE/api.stub.ts" "$WORK/app/src/api/index.ts"
cp "$HERE/provider.stub.tsx" "$WORK/app/src/Provider/FirebaseApp/provider.tsx"
# No Firebase app or analytics is initialized in the isolated capture build.
python3 -I - "$WORK/app/src" <<'PY'
import pathlib, sys
src = pathlib.Path(sys.argv[1])
(src / 'captureAnalytics.ts').write_text('export const logEvent = (..._args: unknown[]): void => {};\n')
for relative in ['Board/index.tsx', 'Greeting/Greeting.tsx', 'Lottery/Lottery.tsx']:
    p = src / relative
    p.write_text(p.read_text().replace("from 'firebase/analytics'", "from '../captureAnalytics'"))
PY

# Approval capture can reuse checked-in screenshot photo pixels offline.
mkdir -p "$WORK/app/public/sample-img"
if [[ "${CAPTURE_OFFLINE:-0}" == 1 ]]; then
  python3 -I - "$REPO/src/Landing/screenshots/board.webp" "$WORK/app" <<'PYIMG'
from PIL import Image
import json, pathlib, sys
source, app = Image.open(sys.argv[1]), pathlib.Path(sys.argv[2])
rects = [(330,154,749,434), (3,207,317,406), (3,3,319,140),
         (326,3,641,142), (804,3,1120,160), (3,415,316,609)]
names = []
for i in range(16):
    name = 'sample-%02d.jpg' % i
    source.crop(rects[i % len(rects)]).convert('RGB').save(app / 'public/sample-img' / name)
    names.append(name)
(app / 'src/api/sampleImages.ts').write_text('export const SAMPLE_IMAGES: string[] = ' + json.dumps(names) + ';\n')
PYIMG
else
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

fi

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

NODE_PATH="$NODE_MODULES" node "$CAPTURE_SCRIPT" "$DEBUG_PORT" "http://127.0.0.1:$APP_PORT" "$WORK/shots"

if [[ -n "${CAPTURE_OUTPUT:-}" ]]; then
  mkdir -p "$CAPTURE_OUTPUT"
  cp "$WORK/shots/"*.png "$CAPTURE_OUTPUT/"
else
  python3 -I "$HERE/to_webp.py" "$WORK/shots" "$REPO/src/Landing/screenshots"
fi
