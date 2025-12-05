import { resolve } from 'path';
import { spawn } from 'child_process';

/**
 * Integration test to ensure the seed script exits cleanly
 * without leaving open handles (detectOpenHandles enabled in Jest config).
 */

describe('Database seed script', () => {
  it('should run to completion with exit code 0', async () => {
    // Path to the seed script (TypeScript).
    const scriptPath = resolve(__dirname, '../scripts/seed.ts');

    // Spawn the seed script via ts-node.
    // Using stdio: 'inherit' helps observe any console output during CI failures.
    const child = spawn(
      process.execPath, // Node.js binary executing ts-node register and script
      [
        // Register ts-node transpiler
        '-r',
        'ts-node/register',
        scriptPath,
      ],
      { stdio: 'inherit' },
    );

    const exitCode: number = await new Promise((resolvePromise, rejectPromise) => {
      child.on('error', rejectPromise);
      child.on('exit', resolvePromise);
    });

    expect(exitCode).toBe(0);
  }, 60_000); // generous timeout for DB operations
});
