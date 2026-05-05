#!/bin/bash
# KOE App - Start script

echo "🎵 Starting KOE App..."

# Start backend
cd "$(dirname "$0")/backend"
npm install --silent 2>/dev/null
node index.js &
BACKEND_PID=$!
echo "✅ Backend started on http://localhost:3001 (PID: $BACKEND_PID)"

# Start frontend
cd "$(dirname "$0")/frontend"
npm install --silent 2>/dev/null
echo "✅ Frontend starting on http://localhost:3000"
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null" EXIT
