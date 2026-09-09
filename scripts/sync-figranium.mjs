import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), '.figranium-source');
const ref = process.env.FIGRANIUM_REF || 'main';
const repo = process.env.FIGRANIUM_REPO || 'https://github.com/figranium/figranium.git';

if (existsSync(root)) rmSync(root, { recursive: true, force: true });

execFileSync('git', ['clone', '--depth', '1', '--branch', ref, repo, root], {
  stdio: 'inherit',
});

console.log(`Synced canonical Figranium UI from ${repo}#${ref}`);
