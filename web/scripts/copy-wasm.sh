#!/bin/bash
# Copy MediaPipe WASM files to public folder
cp -r node_modules/@mediapipe/tasks-vision/wasm public/ 2>/dev/null || true
echo "MediaPipe WASM files copied to public/wasm"
