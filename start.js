import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const backendDir = path.join(__dirname, 'system', 'backend', 'API');
const frontendDir = path.join(__dirname, 'system', 'frontend');

console.log('🚀 Starting Toros System...');

function runProcess(name, command, args, cwd, color) {
    const process = spawn(command, args, {
        cwd,
        shell: true,
        stdio: 'inherit'
    });

    process.on('error', (err) => {
        console.error(`[${name}] Error:`, err);
    });

    process.on('close', (code) => {
        console.log(`[${name}] process exited with code ${code}`);
    });

    return process;
}

// 1. Start Backend
const backend = runProcess('Backend', 'dotnet', ['run'], backendDir);

// 2. Start Frontend
// Attempt to use bun if available, else npm
const frontendCommand = 'npm'; // Default
const frontendArgs = ['run', 'dev'];

const frontend = runProcess('Frontend', frontendCommand, frontendArgs, frontendDir);

// Handle shutdown
const cleanup = () => {
    console.log('\n🛑 Shutting down Toros System...');
    backend.kill();
    frontend.kill();
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
