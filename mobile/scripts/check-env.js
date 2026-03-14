#!/usr/bin/env node

/**
 * Environment Variable Check
 *
 * Warns about missing or placeholder env vars.
 * Does not fail — Supabase is optional.
 *
 * Usage: npm run check-env
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

const PLACEHOLDER_PATTERNS = [
  /^your-/i,
  /^https?:\/\/your-/i,
  /^https?:\/\/api\.example\.com/,
  /^placeholder/i,
  /^change-me/i,
  /^xxx/i,
];

function isPlaceholder(value) {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(value));
}

function run() {
  console.log(`\n  ${c('cyan', 'Environment Check')}\n`);

  if (!fs.existsSync(ENV_PATH)) {
    console.log(`  ${c('yellow', '⚠')} .env file not found`);
    console.log(`    ${c('dim', 'Copy .env.example to .env and fill in your values')}\n`);
    return;
  }

  const content = fs.readFileSync(ENV_PATH, 'utf-8');
  const lines = content.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  let warnings = 0;

  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)/);
    if (!match) continue;
    const [, key, value] = match;
    const trimmed = value.trim();

    if (!trimmed) {
      console.log(`  ${c('yellow', '⚠')} ${key} is empty`);
      warnings++;
    } else if (isPlaceholder(trimmed)) {
      console.log(`  ${c('yellow', '⚠')} ${key} looks like a placeholder: ${c('dim', trimmed)}`);
      warnings++;
    }
  }

  if (warnings === 0) {
    console.log(`  ${c('green', '✓')} All env vars look good\n`);
  } else {
    console.log(`\n  ${c('dim', `${warnings} warning(s) — app may still work without these`)}\n`);
  }
}

run();
