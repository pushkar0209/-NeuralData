#!/bin/bash
cd /vercel/share/v0-project
rm -rf node_modules
rm -f pnpm-lock.yaml
rm -f package-lock.json
rm -f yarn.lock
rm -rf .next
rm -rf dist
rm -rf build
echo "Cleanup completed. Node modules and lock files removed."
