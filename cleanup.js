const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('[v0] Starting dependency cleanup...');

const projectRoot = process.cwd();
const nodeModulesPath = path.join(projectRoot, 'node_modules');
const lockFiles = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb'];

// Remove node_modules
if (fs.existsSync(nodeModulesPath)) {
  console.log('[v0] Removing node_modules...');
  fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  console.log('[v0] node_modules removed');
}

// Remove lock files
for (const lockFile of lockFiles) {
  const lockPath = path.join(projectRoot, lockFile);
  if (fs.existsSync(lockPath)) {
    console.log(`[v0] Removing ${lockFile}...`);
    fs.unlinkSync(lockPath);
  }
}

console.log('[v0] Cleanup complete. Dependencies will be reinstalled automatically.');
