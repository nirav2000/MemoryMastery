#!/usr/bin/env bash
set -euo pipefail

# Optional Codex/CI helper for visual QA. This app has no runtime npm/build requirement.
# Run from the repository root when a runner is missing browser tooling.

if command -v apt-get >/dev/null 2>&1; then
  sudo_cmd=""
  if [ "${EUID:-$(id -u)}" -ne 0 ] && command -v sudo >/dev/null 2>&1; then sudo_cmd="sudo"; fi
  $sudo_cmd apt-get update
  $sudo_cmd apt-get install -y chromium chromium-driver python3-pip
fi

python3 -m pip install --user --upgrade playwright selenium pytest
python3 -m playwright install --with-deps chromium

if command -v chromium >/dev/null 2>&1 || command -v chromium-browser >/dev/null 2>&1 || command -v google-chrome >/dev/null 2>&1; then
  echo "Chromium-compatible browser installed."
else
  echo "No Chromium-compatible browser found after install." >&2
  exit 2
fi
