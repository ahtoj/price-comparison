#!/usr/bin/env bash
# Loads .env and runs the public-api jar. Extra arguments are passed to the jar.
set -euo pipefail
cd "$(dirname "$0")"

ENV_FILE=".env"
JAR_FILE="build/libs/public-api-1.0.0.jar"

[ -f "$ENV_FILE" ] || { echo "ERROR: $ENV_FILE not found in $(pwd)" >&2; exit 1; }
[ -f "$JAR_FILE" ] || { echo "ERROR: $JAR_FILE not found. Build it with: ./gradlew bootJar" >&2; exit 1; }

# Export KEY=VALUE lines, skipping blanks and comments; strips CR from Windows line endings
while IFS= read -r line || [ -n "$line" ]; do
  line="${line%$'\r'}"
  case "$line" in ''|'#'*) continue ;; esac
  [[ "$line" == *=* ]] || continue
  export "${line%%=*}=${line#*=}"
done < "$ENV_FILE"

exec java -jar "$JAR_FILE" "$@"
