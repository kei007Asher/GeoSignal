#!/usr/bin/env node
/**
 * unpack-repopack.mjs
 * Repo Pack形式のMarkdownからファイルを展開するスクリプト
 *
 * Usage:
 *   node tools/unpack-repopack.mjs < repopack.md
 *   cat repopack.md | node tools/unpack-repopack.mjs
 *   node tools/unpack-repopack.mjs --input=repopack.md --output=./out
 */

import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { createInterface } from 'readline';

const args = process.argv.slice(2);
let inputFile = null;
let outputDir = '.';

for (const arg of args) {
  if (arg.startsWith('--input=')) {
    inputFile = arg.slice(8);
  } else if (arg.startsWith('--output=')) {
    outputDir = arg.slice(9);
  }
}

async function ensureDir(filePath) {
  const dir = dirname(filePath);
  await mkdir(dir, { recursive: true });
}

async function main() {
  let input;
  if (inputFile) {
    const { readFile } = await import('fs/promises');
    input = await readFile(inputFile, 'utf-8');
  } else {
    const chunks = [];
    const rl = createInterface({ input: process.stdin });
    for await (const line of rl) {
      chunks.push(line);
    }
    input = chunks.join('\n');
  }

  const filePattern = /^### (.+)\n```(\w*)\n([\s\S]*?)```$/gm;
  let match;
  let count = 0;

  while ((match = filePattern.exec(input)) !== null) {
    const [, filePath, , content] = match;
    const fullPath = join(outputDir, filePath.trim());

    await ensureDir(fullPath);
    await writeFile(fullPath, content);
    console.log(`✓ ${filePath}`);
    count++;
  }

  console.log(`\n✅ ${count} files extracted to ${outputDir}`);
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
