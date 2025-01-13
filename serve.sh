#!/bin/bash
# Build and serve the Insidin site locally
# Usage: ./serve.sh [port]
PORT=${1:-3000}
SITE_DIR="$(dirname "$0")/site"

echo "Building..."
cd "$SITE_DIR" && npm run build
if [ $? -ne 0 ]; then
  echo "Build failed."
  exit 1
fi

echo ""
echo "Serving at http://localhost:$PORT"
echo "Press Ctrl+C to stop"
npx serve -l $PORT dist
