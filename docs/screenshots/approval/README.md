# Capture approval screenshots

The capture builds a temporary copy of the app with an in-memory API and an inert Firebase provider.
Analytics calls are replaced only in that temporary copy. The real app path keeps its API and provider.
Fixtures use photo crops from the checked-in landing wall screenshot, so this capture needs no Firebase access or photo downloads.
Chrome blocks every non-local request, and the browser script fails if one is attempted.
The script cleans up only processes it started and deletes its temporary copy.

Run from the repository in a shell that permits local browser sockets:

```bash
export PATH="/home/box/.nvm/versions/node/v13.14.0/bin:$PATH"
unset NPM_CONFIG_PREFIX
node -v
CAPTURE_NODE_MODULES=/workspace/weddi-deploy/node_modules \
  bash docs/screenshots/approval/capture.sh /usr/bin/google-chrome
```

`node -v` must print `v13.14.0`. Omit `CAPTURE_NODE_MODULES` to use this repository's installed dependencies.
Only the temporary copy runs `yarn build`. The command does not run tests or lint in the worktree.
Use `APP_PORT` and `DEBUG_PORT` to override defaults 5101 and 9335.

The script checks the dashboard toggle in both directions, approves the pending sample greeting, and verifies that the greeting appears on the wall only after approval.
It also checks that a historical greeting remains visible and that the dashboard fits a 390px viewport.
It writes these files beside this README:

- `dashboard-1280.png`: toggle on and pending queue at 1280 × 1000.
- `dashboard-390.png`: the same host view at 390 × 1000.
- `board-pending-1280.png`: the historical greeting on the wall while the new sample greeting waits, at 1280 × 720.
- `board-approved-1280.png`: the newly approved sample greeting on the wall, at 1280 × 720.

The four PNGs in this folder were captured from an isolated mock build. No production Firebase reads or writes occurred.
Chrome may probe fonts.googleapis.com during capture; those requests are failed and must not reach a backend.
