#!/usr/bin/env node

/**
 * Project Health Check (Doctor)
 *
 * Runs quick diagnostics on the project setup.
 * Exit code 0 = all pass, 1 = failures found.
 * Warnings don't affect exit code.
 *
 * Usage: npm run doctor
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

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

let failures = 0;
let warnings = 0;

function pass(msg) {
  console.log(`  ${c('green', '✓')} ${msg}`);
}

function fail(msg) {
  console.log(`  ${c('red', '✗')} ${msg}`);
  failures++;
}

function warn(msg) {
  console.log(`  ${c('yellow', '⚠')} ${msg}`);
  warnings++;
}

function fileExists(p) {
  return fs.existsSync(path.join(ROOT, p));
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf-8'));
}

function run() {
  console.log(`\n  ${c('cyan', 'Project Health Check')}\n`);

  // 1. node_modules exists
  if (fileExists('node_modules')) {
    pass('node_modules installed');
  } else {
    fail('node_modules missing — run npm install');
  }

  // 2. .env file
  if (fileExists('.env')) {
    const content = fs.readFileSync(path.join(ROOT, '.env'), 'utf-8');
    const placeholderPattern = /=(your-|https?:\/\/your-|placeholder|change-me)/i;
    if (placeholderPattern.test(content)) {
      warn('.env has placeholder values');
    } else {
      pass('.env file exists');
    }
  } else {
    warn('.env file not found (optional — copy .env.example)');
  }

  // 3. app.json not using template defaults
  try {
    const appJson = readJSON('app.json');
    const expo = appJson.expo || {};

    if (expo.name === 'My App') {
      warn('app.json still using default name "My App"');
    } else {
      pass(`app.json name: "${expo.name}"`);
    }

    const bundleId = expo.ios?.bundleIdentifier;
    if (bundleId === 'com.myapp.app') {
      warn('app.json using default bundleIdentifier "com.myapp.app"');
    }

    if (expo.slug === 'my-app') {
      warn('app.json using default slug "my-app"');
    }
  } catch {
    fail('app.json could not be parsed');
  }

  // 4. package.json name
  try {
    const pkg = readJSON('package.json');
    if (pkg.name === 'rncopilot') {
      warn('package.json still using template name "rncopilot"');
    } else {
      pass(`package.json name: "${pkg.name}"`);
    }
  } catch {
    fail('package.json could not be parsed');
  }

  // 5. eas.json placeholder check
  if (fileExists('eas.json')) {
    try {
      const eas = readJSON('eas.json');
      const appleId = eas.submit?.production?.ios?.appleId;
      if (appleId && /placeholder|example|your-/i.test(appleId)) {
        warn('eas.json has placeholder Apple ID');
      } else {
        pass('eas.json looks good');
      }
    } catch {
      warn('eas.json could not be parsed');
    }
  }

  // 6. Locale files parse correctly
  const enPath = path.join(ROOT, 'src', 'i18n', 'locales', 'en.json');
  const arPath = path.join(ROOT, 'src', 'i18n', 'locales', 'ar.json');

  let enKeys = 0;
  let arKeys = 0;

  try {
    const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    enKeys = countKeys(en);
    pass(`en.json parses OK (${enKeys} keys)`);
  } catch {
    fail('en.json could not be parsed');
  }

  if (fs.existsSync(arPath)) {
    try {
      const ar = JSON.parse(fs.readFileSync(arPath, 'utf-8'));
      arKeys = countKeys(ar);
      pass(`ar.json parses OK (${arKeys} keys)`);
    } catch {
      fail('ar.json could not be parsed');
    }

    // 7. i18n key parity
    if (enKeys > 0 && arKeys > 0) {
      if (enKeys === arKeys) {
        pass(`i18n parity: ${enKeys} keys in both files`);
      } else {
        warn(
          `i18n mismatch: en has ${enKeys} keys, ar has ${arKeys} keys — run npm run i18n:check`
        );
      }
    }
  }

  // Summary
  console.log('');
  if (failures > 0) {
    console.log(
      `  ${c('red', `${failures} failure(s)`)}${warnings > 0 ? `, ${warnings} warning(s)` : ''}\n`
    );
    process.exit(1);
  } else if (warnings > 0) {
    console.log(`  ${c('green', 'No failures')} — ${c('yellow', `${warnings} warning(s)`)}\n`);
    process.exit(0);
  } else {
    console.log(`  ${c('green', 'All checks passed!')}\n`);
    process.exit(0);
  }
}

function countKeys(obj) {
  let count = 0;
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      count += countKeys(value);
    } else {
      count++;
    }
  }
  return count;
}

run();
