#!/bin/zsh

# Docker starten, wenn nicht schon läuft
if ! docker info >/dev/null 2>&1; then
  echo "Starte Docker Desktop..."
  open -a Docker --hide

  # Warte, bis Docker wirklich läuft
  while ! docker info >/dev/null 2>&1; do
    sleep 1
  done
  echo "Docker ist jetzt bereit!"
else
  echo "Docker läuft schon."
fi
