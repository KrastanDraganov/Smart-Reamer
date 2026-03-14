#!/usr/bin/env node

/**
 * i18n Key Parity Check
 *
 * Recursively compares all keys in en.json vs ar.json.
 * Reports missing keys and empty string values.
 *
 * Usage: npm run i18n:check
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.resolve(__dirname, '..', 'src', 'i18n', 'locales');
const EN_PATH = path.join(LOCALES_DIR, 'en.json');
const AR_PATH = path.join(LOCALES_DIR, 'ar.json');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getValueAtPath(obj, keyPath) {
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = current[part];
  }
  return current;
}

function run() {
  console.log(`\n  ${c('cyan', 'i18n Key Parity Check')}\n`);

  // Parse locale files
  let en, ar;
  try {
    en = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));
  } catch (err) {
    console.log(`  ${c('red', '✗')} Failed to parse en.json: ${err.message}`);
    process.exit(1);
  }

  if (!fs.existsSync(AR_PATH)) {
    console.log(`  ${c('yellow', '⊘')} ar.json not found — skipping parity check\n`);
    process.exit(0);
  }

  try {
    ar = JSON.parse(fs.readFileSync(AR_PATH, 'utf-8'));
  } catch (err) {
    console.log(`  ${c('red', '✗')} Failed to parse ar.json: ${err.message}`);
    process.exit(1);
  }

  const enKeys = getAllKeys(en);
  const arKeys = getAllKeys(ar);
  const enSet = new Set(enKeys);
  const arSet = new Set(arKeys);

  let hasErrors = false;

  // Keys in en missing from ar
  const missingInAr = enKeys.filter((k) => !arSet.has(k));
  if (missingInAr.length > 0) {
    hasErrors = true;
    console.log(`  ${c('red', '✗')} Keys in en.json missing from ar.json (${missingInAr.length}):`);
    missingInAr.forEach((k) => console.log(`    ${c('dim', '-')} ${k}`));
    console.log('');
  }

  // Keys in ar missing from en
  const missingInEn = arKeys.filter((k) => !enSet.has(k));
  if (missingInEn.length > 0) {
    hasErrors = true;
    console.log(`  ${c('red', '✗')} Keys in ar.json missing from en.json (${missingInEn.length}):`);
    missingInEn.forEach((k) => console.log(`    ${c('dim', '-')} ${k}`));
    console.log('');
  }

  // Empty values in en
  const emptyInEn = enKeys.filter((k) => getValueAtPath(en, k) === '');
  if (emptyInEn.length > 0) {
    hasErrors = true;
    console.log(`  ${c('yellow', '⚠')} Empty values in en.json (${emptyInEn.length}):`);
    emptyInEn.forEach((k) => console.log(`    ${c('dim', '-')} ${k}`));
    console.log('');
  }

  // Empty values in ar
  const emptyInAr = arKeys.filter((k) => getValueAtPath(ar, k) === '');
  if (emptyInAr.length > 0) {
    hasErrors = true;
    console.log(`  ${c('yellow', '⚠')} Empty values in ar.json (${emptyInAr.length}):`);
    emptyInAr.forEach((k) => console.log(`    ${c('dim', '-')} ${k}`));
    console.log('');
  }

  if (!hasErrors) {
    console.log(
      `  ${c('green', '✓')} All ${enKeys.length} keys match between en.json and ar.json\n`
    );
    process.exit(0);
  } else {
    process.exit(1);
  }
}

run();
