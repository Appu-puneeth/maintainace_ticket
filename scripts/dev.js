// Starts the Express API server (port 5000) and the Vite dev server (port 5173) together.
// Usage: npm run dev
import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';

const children = [];

const run = (label, args) => {
  const child = spawn('npm', args, {
    stdio: 'inherit',
    shell: isWindows,
    env: process.env,
  });
  child.on('exit', (code) => {
    console.log(`[dev] ${label} exited with code ${code}`);
    shutdown(code ?? 0);
  });
  children.push(child);
  return child;
};

let shuttingDown = false;
const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      try {
        child.kill('SIGTERM');
      } catch {
        // ignore
      }
    }
  }
  process.exit(code);
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

run('api', ['run', 'server']);
run('web', ['run', 'dev:web']);
