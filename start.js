import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const backendDir = path.join(__dirname, 'system', 'backend', 'API');
const frontendDir = path.join(__dirname, 'system', 'frontend');

console.log('🚀 Starting Toros System...');

function runProcess(name, command, args, cwd) {
    const child = spawn(command, args, {
        cwd,
        shell: true,
        stdio: 'inherit',
        env: { ...process.env, FORCE_COLOR: '1' }
    });

    child.on('error', (err) => {
        console.error(`[${name}] Error:`, err);
    });

    return child;
}

// Parse arguments
const args = process.argv.slice(2);
const startBackend = args.includes('--backend') || (!args.includes('--frontend') && !args.includes('--backend'));
const startFrontend = args.includes('--frontend') || (!args.includes('--frontend') && !args.includes('--backend'));

// 1. Start Backend
let backend;
if (startBackend) {
    backend = runProcess('Backend', 'dotnet', ['run'], backendDir);
}

// 2. Start Frontend
let frontend;
if (startFrontend) {
    // Check if running with bun
    const isBun = process.argv[0].includes('bun');
    const frontendCommand = isBun ? 'bun' : 'npm';
    const frontendArgs = isBun ? ['run', 'dev'] : ['run', 'dev'];

    frontend = runProcess('Frontend', frontendCommand, frontendArgs, frontendDir);
}

// Handle shutdown
const cleanup = () => {
    console.log('\n🛑 Shutting down Toros System...');
    if (backend) backend.kill();
    if (frontend) frontend.kill();
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
