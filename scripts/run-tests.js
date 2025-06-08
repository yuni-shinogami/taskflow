#!/usr/bin/env node

import { spawn } from 'child_process';
import { readdir } from 'fs/promises';
import { join } from 'path';

const args = process.argv.slice(2);
const testDir = 'e2e';

async function listTests() {
  const files = await readdir(testDir);
  const testFiles = files.filter(f => f.endsWith('.spec.ts'));
  
  console.log('\n📋 Available test suites:\n');
  testFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file.replace('.spec.ts', '')}`);
  });
  console.log('\n');
}

async function runTest(testName) {
  const testFile = testName.endsWith('.spec.ts') ? testName : `${testName}.spec.ts`;
  const testPath = join(testDir, testFile);
  
  console.log(`\n🧪 Running ${testFile}...\n`);
  
  const playwright = spawn('npx', ['playwright', 'test', testPath], {
    stdio: 'inherit',
    shell: true
  });
  
  playwright.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Tests passed!');
    } else {
      console.log(`\n❌ Tests failed with code ${code}`);
    }
    process.exit(code);
  });
}

async function main() {
  if (args.length === 0 || args[0] === '--list' || args[0] === '-l') {
    await listTests();
    console.log('Usage: npm run test:suite <test-name>');
    console.log('Example: npm run test:suite taskflow');
    return;
  }
  
  const testName = args[0];
  await runTest(testName);
}

main().catch(console.error);