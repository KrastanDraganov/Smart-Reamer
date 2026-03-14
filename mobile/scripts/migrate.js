#!/usr/bin/env node

/**
 * Interactive Migration Script
 *
 * Walks users through adapting this template for their specific app
 * without needing an AI agent. Asks questions and applies changes automatically.
 *
 * Usage: npm run migrate
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');

// ─────────────────────────────────────────────
// UI Helpers
// ─────────────────────────────────────────────

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;
const bold = (text) => c('bold', text);
const dim = (text) => c('dim', text);
const green = (text) => c('green', text);
const yellow = (text) => c('yellow', text);
const blue = (text) => c('blue', text);
const cyan = (text) => c('cyan', text);
const red = (text) => c('red', text);
const magenta = (text) => c('magenta', text);

function banner() {
  console.log('');
  console.log(blue('  ╔══════════════════════════════════════════════════════╗'));
  console.log(
    blue('  ║') + bold('   React Native Expo Template — Migration Wizard   ') + blue('║')
  );
  console.log(blue('  ╚══════════════════════════════════════════════════════╝'));
  console.log('');
  console.log(dim('  This wizard will walk you through adapting this template'));
  console.log(dim('  for your specific app. You can skip any step.\n'));
}

function sectionHeader(number, title) {
  console.log('');
  console.log(magenta(`  ── Step ${number} ──────────────────────────────────────`));
  console.log(bold(`  ${title}`));
  console.log('');
}

function success(message) {
  console.log(green(`    ✓ ${message}`));
}

function skip(message) {
  console.log(yellow(`    ⊘ Skipped: ${message}`));
}

function info(message) {
  console.log(cyan(`    ℹ ${message}`));
}

function warn(message) {
  console.log(yellow(`    ⚠ ${message}`));
}

function error(message) {
  console.log(red(`    ✗ ${message}`));
}

// ─────────────────────────────────────────────
// Prompt Helpers
// ─────────────────────────────────────────────

function createRL() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl, question, defaultValue) {
  const defaultHint = defaultValue ? dim(` (${defaultValue})`) : '';
  return new Promise((resolve) => {
    rl.question(`    ${question}${defaultHint}: `, (answer) => {
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

function askYesNo(rl, question, defaultYes = true) {
  const hint = defaultYes ? dim(' (Y/n)') : dim(' (y/N)');
  return new Promise((resolve) => {
    rl.question(`    ${question}${hint}: `, (answer) => {
      const a = answer.trim().toLowerCase();
      if (a === '') resolve(defaultYes);
      else resolve(a === 'y' || a === 'yes');
    });
  });
}

function askChoice(rl, question, options) {
  return new Promise((resolve) => {
    console.log(`    ${question}`);
    options.forEach((opt, i) => {
      console.log(dim(`      ${i + 1}) ${opt.label}`) + (opt.hint ? dim(` — ${opt.hint}`) : ''));
    });
    rl.question(`    ${dim('Choose')} (1-${options.length}): `, (answer) => {
      const idx = parseInt(answer.trim(), 10) - 1;
      if (idx >= 0 && idx < options.length) {
        resolve(options[idx].value);
      } else {
        resolve(options[0].value);
      }
    });
  });
}

// ─────────────────────────────────────────────
// File Helpers
// ─────────────────────────────────────────────

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// ─────────────────────────────────────────────
// Color Presets
// ─────────────────────────────────────────────

const COLOR_PRESETS = {
  indigo: {
    label: 'Indigo + Teal (default)',
    hint: 'trustworthy, modern',
    light: { primary: '#6366F1', primaryVariant: '#4F46E5', tertiary: '#14B8A6' },
    dark: { primary: '#818CF8', primaryVariant: '#A5B4FC', tertiary: '#2DD4BF' },
  },
  blue: {
    label: 'Blue + Orange',
    hint: 'classic, energetic',
    light: { primary: '#3B82F6', primaryVariant: '#2563EB', tertiary: '#F97316' },
    dark: { primary: '#60A5FA', primaryVariant: '#93C5FD', tertiary: '#FB923C' },
  },
  emerald: {
    label: 'Emerald + Amber',
    hint: 'natural, warm',
    light: { primary: '#10B981', primaryVariant: '#059669', tertiary: '#F59E0B' },
    dark: { primary: '#34D399', primaryVariant: '#6EE7B7', tertiary: '#FBBF24' },
  },
  violet: {
    label: 'Violet + Rose',
    hint: 'creative, bold',
    light: { primary: '#8B5CF6', primaryVariant: '#7C3AED', tertiary: '#F43F5E' },
    dark: { primary: '#A78BFA', primaryVariant: '#C4B5FD', tertiary: '#FB7185' },
  },
  slate: {
    label: 'Slate + Cyan',
    hint: 'minimal, professional',
    light: { primary: '#475569', primaryVariant: '#334155', tertiary: '#06B6D4' },
    dark: { primary: '#94A3B8', primaryVariant: '#CBD5E1', tertiary: '#22D3EE' },
  },
  custom: {
    label: 'Custom colors',
    hint: 'enter your own hex values',
    light: null,
    dark: null,
  },
};

// ─────────────────────────────────────────────
// Migration Steps
// ─────────────────────────────────────────────

async function stepAppIdentity(rl) {
  sectionHeader(1, 'App Identity');

  const appName = await ask(rl, 'App name (displayed to users)', '');
  if (!appName) {
    skip('App identity');
    return;
  }

  const slug = await ask(
    rl,
    'App slug (URL-friendly, lowercase)',
    appName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  );

  const bundleId = await ask(
    rl,
    'Bundle identifier (e.g. com.company.appname)',
    `com.app.${slug.replace(/-/g, '')}`
  );

  const scheme = await ask(rl, 'Deep link scheme (e.g. myapp)', slug.replace(/-/g, ''));

  // Update app.json
  const appJsonPath = path.join(ROOT, 'app.json');
  const appJson = readJSON(appJsonPath);

  appJson.expo.name = appName;
  appJson.expo.slug = slug;
  appJson.expo.scheme = scheme;
  appJson.expo.ios.bundleIdentifier = bundleId;
  appJson.expo.android.package = bundleId;

  writeJSON(appJsonPath, appJson);
  success(`app.json updated — name: "${appName}", slug: "${slug}"`);

  // Update package.json
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = readJSON(pkgPath);
  pkg.name = slug;
  writeJSON(pkgPath, pkg);
  success(`package.json name set to "${slug}"`);

  // Update i18n welcome text
  const shouldUpdateWelcome = await askYesNo(
    rl,
    `Update home screen welcome text to "${appName}"?`
  );

  if (shouldUpdateWelcome) {
    const enPath = path.join(ROOT, 'src', 'i18n', 'locales', 'en.json');
    const arPath = path.join(ROOT, 'src', 'i18n', 'locales', 'ar.json');

    if (fileExists(enPath)) {
      const en = readJSON(enPath);
      en.home = en.home || {};
      en.home.welcome = `Welcome to ${appName}`;
      en.home.subtitle = `Your ${appName} app is ready to go.`;
      writeJSON(enPath, en);
      success('English welcome text updated');
    }

    const arName = await ask(rl, 'App name in Arabic (or press Enter to skip)', '');
    if (arName && fileExists(arPath)) {
      const ar = readJSON(arPath);
      ar.home = ar.home || {};
      ar.home.welcome = `مرحبًا بك في ${arName}`;
      ar.home.subtitle = `تطبيق ${arName} جاهز للاستخدام.`;
      writeJSON(arPath, ar);
      success('Arabic welcome text updated');
    }
  }
}

async function stepTheme(rl) {
  sectionHeader(2, 'Theme & Colors');

  const presetKeys = Object.keys(COLOR_PRESETS);
  const presetChoice = await askChoice(
    rl,
    'Choose a color palette:',
    presetKeys.map((key) => ({
      label: COLOR_PRESETS[key].label,
      hint: COLOR_PRESETS[key].hint,
      value: key,
    }))
  );

  if (presetChoice === 'custom') {
    info('For custom colors, edit these files manually:');
    info('  src/theme/light-theme.ts — brand.primary, brand.tertiary');
    info('  src/theme/dark-theme.ts  — brand.primary, brand.tertiary');
    info('Tip: Use Tailwind CSS color palette for consistent shades.');
    skip('Custom colors — manual edit needed');
    return;
  }

  const preset = COLOR_PRESETS[presetChoice];
  if (!preset || presetChoice === 'indigo') {
    skip('Keeping default Indigo + Teal palette');
    return;
  }

  // Update light theme
  const lightPath = path.join(ROOT, 'src', 'theme', 'light-theme.ts');
  let lightContent = readFile(lightPath);
  lightContent = replaceBrandColor(lightContent, 'primary', preset.light.primary);
  lightContent = replaceBrandColor(lightContent, 'primaryVariant', preset.light.primaryVariant);
  lightContent = replaceBrandColor(lightContent, 'tertiary', preset.light.tertiary);
  writeFile(lightPath, lightContent);
  success(`Light theme updated — primary: ${preset.light.primary}`);

  // Update dark theme
  const darkPath = path.join(ROOT, 'src', 'theme', 'dark-theme.ts');
  let darkContent = readFile(darkPath);
  darkContent = replaceBrandColor(darkContent, 'primary', preset.dark.primary);
  darkContent = replaceBrandColor(darkContent, 'primaryVariant', preset.dark.primaryVariant);
  darkContent = replaceBrandColor(darkContent, 'tertiary', preset.dark.tertiary);
  writeFile(darkPath, darkContent);
  success(`Dark theme updated — primary: ${preset.dark.primary}`);

  // Update overlay/gradient colors that reference the old primary
  info('Note: overlay and gradient colors may still reference old palette.');
  info('Run the app and check if pressed/focus states look right.');
}

async function stepLanguages(rl) {
  sectionHeader(3, 'Languages & i18n');

  const keepArabic = await askYesNo(rl, 'Keep Arabic (AR) translations and RTL support?', true);

  if (!keepArabic) {
    const removeArabic = await askYesNo(rl, 'Remove Arabic locale file and simplify i18n config?');

    if (removeArabic) {
      // Remove ar.json
      const arPath = path.join(ROOT, 'src', 'i18n', 'locales', 'ar.json');
      if (fileExists(arPath)) {
        fs.unlinkSync(arPath);
        success('Removed ar.json');
      }

      // Update i18n config
      const configPath = path.join(ROOT, 'src', 'i18n', 'config.ts');
      if (fileExists(configPath)) {
        let config = readFile(configPath);
        // Remove Arabic import line
        config = config.replace(/import\s+ar\s+from.*\n/g, '');
        // Remove ar: { translation: ar } from resources object
        config = config.replace(/,?\s*\bar\b:\s*\{\s*translation:\s*\bar\b\s*\}/g, '');
        // Remove 'ar' from array literals like fallbackLng: ['en', 'ar']
        config = config.replace(/,\s*['"]ar['"]/g, '');
        writeFile(configPath, config);
        success('i18n config simplified (AR removed)');
      }

      // Update app.json locale config
      const appJsonPath = path.join(ROOT, 'app.json');
      const appJson = readJSON(appJsonPath);
      if (appJson.expo.ios?.infoPlist?.CFBundleLocalizations) {
        appJson.expo.ios.infoPlist.CFBundleLocalizations = ['en'];
      }
      // Update expo-localization plugin
      const locPlugin = appJson.expo.plugins?.find(
        (p) => Array.isArray(p) && p[0] === 'expo-localization'
      );
      if (locPlugin && locPlugin[1]?.supportedLocales) {
        locPlugin[1].supportedLocales.ios = ['en'];
        locPlugin[1].supportedLocales.android = ['en'];
      }
      writeJSON(appJsonPath, appJson);
      success('app.json locales updated');

      warn('You may need to remove supportsRTL from app.json if not needed.');
    }
  }

  const addLanguage = await askYesNo(rl, 'Add another language?', false);
  if (addLanguage) {
    const langCode = await ask(rl, 'Language code (e.g. es, fr, de, tr)', '');
    if (langCode) {
      // Copy en.json as starting point
      const enPath = path.join(ROOT, 'src', 'i18n', 'locales', 'en.json');
      const newPath = path.join(ROOT, 'src', 'i18n', 'locales', `${langCode}.json`);
      if (fileExists(enPath)) {
        fs.copyFileSync(enPath, newPath);
        success(`Created ${langCode}.json (copy of en.json — translate the values)`);
        info(`Next steps:`);
        info(`  1. Translate src/i18n/locales/${langCode}.json`);
        info(`  2. Add import in src/i18n/config.ts`);
        info(`  3. Add "${langCode}" to app.json locales`);
      }
    }
  }
}

async function stepBackend(rl) {
  sectionHeader(4, 'Backend Configuration');

  const hasSupabase = await askYesNo(rl, 'Will you use Supabase as your backend?', false);

  const envPath = path.join(ROOT, '.env');
  const envExamplePath = path.join(ROOT, '.env.example');

  if (hasSupabase) {
    const supabaseUrl = await ask(rl, 'Supabase project URL', '');
    const supabaseKey = await ask(rl, 'Supabase anon/public key', '');

    if (supabaseUrl || supabaseKey) {
      let envContent = '';
      if (fileExists(envExamplePath)) {
        envContent = readFile(envExamplePath);
      }
      if (supabaseUrl) {
        envContent = envContent.replace(
          /EXPO_PUBLIC_SUPABASE_URL=.*/,
          `EXPO_PUBLIC_SUPABASE_URL=${supabaseUrl}`
        );
      }
      if (supabaseKey) {
        envContent = envContent.replace(
          /EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY=.*/,
          `EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY=${supabaseKey}`
        );
      }
      writeFile(envPath, envContent);
      success('.env created with Supabase credentials');
      warn('Make sure .env is in your .gitignore (it should be by default)');
    }
  } else {
    info('App will work without Supabase. The template gracefully handles missing credentials.');

    const apiUrl = await ask(rl, 'Custom API base URL (or press Enter to skip)', '');
    if (apiUrl) {
      let envContent = '';
      if (fileExists(envExamplePath)) {
        envContent = readFile(envExamplePath);
      } else {
        envContent = 'EXPO_PUBLIC_API_BASE_URL=\nEXPO_PUBLIC_APP_ENV=development\n';
      }
      envContent = envContent.replace(
        /EXPO_PUBLIC_API_BASE_URL=.*/,
        `EXPO_PUBLIC_API_BASE_URL=${apiUrl}`
      );
      writeFile(envPath, envContent);
      success(`.env created with API URL: ${apiUrl}`);
    }
  }
}

async function stepNavigation(rl) {
  sectionHeader(5, 'Navigation Tabs');

  info('Current tabs: Home, Settings');
  const addTabs = await askYesNo(rl, 'Add more tabs?', false);

  if (!addTabs) {
    skip('Keeping default tabs');
    return;
  }

  const tabNames = [];
  let adding = true;

  while (adding) {
    const tabName = await ask(rl, 'Tab name (e.g. Profile, Explore, Cart)', '');
    if (!tabName) break;
    tabNames.push(tabName);

    adding = await askYesNo(rl, 'Add another tab?', false);
  }

  if (tabNames.length === 0) {
    skip('No tabs added');
    return;
  }

  const tabsDir = path.join(ROOT, 'app', '(main)', '(tabs)');

  for (const tabName of tabNames) {
    const fileName = tabName.toLowerCase().replace(/\s+/g, '-');
    const componentName = tabName.replace(/\s+/g, '');
    const tabFilePath = path.join(tabsDir, `${fileName}.tsx`);

    const tabContent = `import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { ScreenContainer, Text } from '@/common/components';

export default function ${componentName}Tab() {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text variant="h2">{t('tabs.${fileName}')}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.metrics.spacing.p16,
    paddingTop: theme.metrics.spacingV.p16,
  },
}));
`;
    writeFile(tabFilePath, tabContent);
    success(`Created ${fileName}.tsx tab screen`);

    // Add i18n key
    const enPath = path.join(ROOT, 'src', 'i18n', 'locales', 'en.json');
    if (fileExists(enPath)) {
      const en = readJSON(enPath);
      en.tabs = en.tabs || {};
      en.tabs[fileName] = tabName;
      writeJSON(enPath, en);
    }

    const arPath = path.join(ROOT, 'src', 'i18n', 'locales', 'ar.json');
    if (fileExists(arPath)) {
      const ar = readJSON(arPath);
      ar.tabs = ar.tabs || {};
      ar.tabs[fileName] = tabName; // placeholder — user should translate
      writeJSON(arPath, ar);
    }
  }

  info("Don't forget to add the new tabs to the tab layout:");
  info(`  File: app/(main)/(tabs)/_layout.tsx`);
  info(
    `  Add a <Tabs.Screen name="${tabNames[0].toLowerCase().replace(/\s+/g, '-')}" ... /> for each tab`
  );
}

async function stepFeatureScaffold(rl) {
  sectionHeader(6, 'Scaffold First Feature');

  const featureName = await ask(rl, 'Feature name (e.g. products, chat, games)', '');

  if (!featureName) {
    skip('Feature scaffolding');
    return;
  }

  const featureDir = path.join(ROOT, 'src', 'features', featureName);

  if (fileExists(featureDir)) {
    warn(`Feature "${featureName}" already exists, skipping scaffold`);
    return;
  }

  // Create directory structure
  const dirs = ['components', 'services', 'hooks', 'types', 'constants', 'stores', 'schemas'];
  dirs.forEach((dir) => {
    fs.mkdirSync(path.join(featureDir, dir), { recursive: true });
  });

  // Create types file
  writeFile(
    path.join(featureDir, 'types', `${featureName}.types.ts`),
    `// Types for the ${featureName} feature\n\nexport interface ${capitalize(featureName)}Item {\n  id: string;\n  // TODO: Add your fields here\n}\n`
  );

  // Create service file
  writeFile(
    path.join(featureDir, 'services', `${featureName}Service.ts`),
    `import { api } from '@/services/api';\nimport type { ${capitalize(featureName)}Item } from '../types/${featureName}.types';\n\nexport async function get${capitalize(featureName)}List(): Promise<${capitalize(featureName)}Item[]> {\n  const response = await api.get('/${featureName}');\n  return response.data;\n}\n\nexport async function get${capitalize(featureName)}ById(id: string): Promise<${capitalize(featureName)}Item> {\n  const response = await api.get(\`/${featureName}/\${id}\`);\n  return response.data;\n}\n`
  );

  // Create hook file
  writeFile(
    path.join(featureDir, 'hooks', `use${capitalize(featureName)}.ts`),
    `import { useQuery } from '@tanstack/react-query';\nimport { get${capitalize(featureName)}List } from '../services/${featureName}Service';\n\nexport function use${capitalize(featureName)}List() {\n  return useQuery({\n    queryKey: ['${featureName}'],\n    queryFn: get${capitalize(featureName)}List,\n  });\n}\n`
  );

  // Create placeholder component
  writeFile(
    path.join(featureDir, 'components', `${capitalize(featureName)}List.tsx`),
    `import { useTranslation } from 'react-i18next';\nimport { View } from 'react-native';\nimport { StyleSheet } from 'react-native-unistyles';\nimport { Text, Loading, EmptyState } from '@/common/components';\nimport { use${capitalize(featureName)}List } from '../hooks/use${capitalize(featureName)}';\n\nexport function ${capitalize(featureName)}List() {\n  const { t } = useTranslation();\n  const { data, isLoading } = use${capitalize(featureName)}List();\n\n  if (isLoading) return <Loading />;\n\n  if (!data?.length) {\n    return (\n      <EmptyState\n        icon="folder-open-outline"\n        message={t('${featureName}.empty')}\n      />\n    );\n  }\n\n  return (\n    <View style={styles.container}>\n      <Text variant="h2">{t('${featureName}.title')}</Text>\n      {/* TODO: Render your list items here */}\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create((theme) => ({\n  container: {\n    flex: 1,\n    padding: theme.metrics.spacing.p16,\n    gap: theme.metrics.spacingV.p12,\n  },\n}));\n`
  );

  // Create store placeholder
  writeFile(
    path.join(featureDir, 'stores', 'index.ts'),
    `// Zustand stores for the ${featureName} feature\n`
  );

  // Create schema placeholder
  writeFile(
    path.join(featureDir, 'schemas', 'index.ts'),
    `// Zod schemas for the ${featureName} feature\n`
  );

  // Create barrel export
  writeFile(
    path.join(featureDir, 'components', 'index.ts'),
    `export { ${capitalize(featureName)}List } from './${capitalize(featureName)}List';\n`
  );

  // Add i18n keys
  const enPath = path.join(ROOT, 'src', 'i18n', 'locales', 'en.json');
  if (fileExists(enPath)) {
    const en = readJSON(enPath);
    en[featureName] = {
      title: capitalize(featureName),
      empty: `No ${featureName} found`,
    };
    writeJSON(enPath, en);
  }

  const arPath = path.join(ROOT, 'src', 'i18n', 'locales', 'ar.json');
  if (fileExists(arPath)) {
    const ar = readJSON(arPath);
    ar[featureName] = {
      title: capitalize(featureName),
      empty: `لا يوجد ${featureName}`,
    };
    writeJSON(arPath, ar);
  }

  success(`Feature "${featureName}" scaffolded:`);
  console.log(dim(`      src/features/${featureName}/`));
  console.log(dim(`      ├── components/${capitalize(featureName)}List.tsx`));
  console.log(dim(`      ├── hooks/use${capitalize(featureName)}.ts`));
  console.log(dim(`      ├── services/${featureName}Service.ts`));
  console.log(dim(`      ├── types/${featureName}.types.ts`));
  console.log(dim(`      ├── constants/`));
  console.log(dim(`      ├── stores/`));
  console.log(dim(`      └── schemas/`));
}

async function stepEAS(rl) {
  sectionHeader(7, 'EAS Build Configuration');

  const configureEAS = await askYesNo(
    rl,
    'Configure EAS (Expo Application Services) for builds?',
    false
  );

  if (!configureEAS) {
    skip('EAS configuration');
    return;
  }

  const easPath = path.join(ROOT, 'eas.json');
  if (!fileExists(easPath)) {
    skip('eas.json not found');
    return;
  }

  const eas = readJSON(easPath);

  // Initialize nested path before both asks so it's safe regardless of skip order
  eas.submit = eas.submit || {};
  eas.submit.production = eas.submit.production || {};
  eas.submit.production.ios = eas.submit.production.ios || {};

  const appleId = await ask(rl, 'Apple ID email (for iOS App Store)', '');
  if (appleId) {
    eas.submit.production.ios.appleId = appleId;
    success(`Apple ID set to ${appleId}`);
  }

  const ascAppId = await ask(rl, 'App Store Connect App ID', '');
  if (ascAppId) {
    eas.submit.production.ios.ascAppId = ascAppId;
    success(`ASC App ID set to ${ascAppId}`);
  }

  const easProjectId = await ask(rl, 'EAS Project ID (from expo.dev)', '');
  if (easProjectId) {
    const appJsonPath = path.join(ROOT, 'app.json');
    const appJson = readJSON(appJsonPath);
    appJson.expo.extra = appJson.expo.extra || {};
    appJson.expo.extra.eas = appJson.expo.extra.eas || {};
    appJson.expo.extra.eas.projectId = easProjectId;
    writeJSON(appJsonPath, appJson);
    success(`EAS Project ID set in app.json`);
  }

  writeJSON(easPath, eas);
  success('eas.json updated');
}

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function replaceBrandColor(content, key, value) {
  return content.replace(
    new RegExp(`(brand:\\s*\\{[^}]*?\\b${key}:\\s*)'#[0-9A-Fa-f]{6}'`, 's'),
    `$1'${value}'`
  );
}

// ─────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────

function printSummary() {
  console.log('');
  console.log(blue('  ╔══════════════════════════════════════════════════════╗'));
  console.log(
    blue('  ║') + bold('               Migration Complete!                  ') + blue('║')
  );
  console.log(blue('  ╚══════════════════════════════════════════════════════╝'));
  console.log('');
  console.log(bold('  Next steps:'));
  console.log('');
  console.log(`    1. Review the changes: ${cyan('git diff')}`);
  console.log(`    2. Run type checking:  ${cyan('npm run type-check')}`);
  console.log(`    3. Run linting:        ${cyan('npm run lint')}`);
  console.log(`    4. Start the app:      ${cyan('npm start')}`);
  console.log('');
  console.log(dim('  For the full migration guide, see docs/MIGRATION.md'));
  console.log(dim('  For component API reference, see docs/COMPONENTS.md'));
  console.log('');
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

async function main() {
  banner();

  const rl = createRL();

  try {
    const proceed = await askYesNo(rl, 'Ready to start the migration wizard?');

    if (!proceed) {
      console.log("\n  No worries! Run this again when you're ready.\n");
      rl.close();
      return;
    }

    await stepAppIdentity(rl);
    await stepTheme(rl);
    await stepLanguages(rl);
    await stepBackend(rl);
    await stepNavigation(rl);
    await stepFeatureScaffold(rl);
    await stepEAS(rl);

    printSummary();
  } catch (err) {
    if (err.message === 'readline was closed') {
      console.log('\n\n  Migration cancelled.\n');
    } else {
      console.error(`\n  ${red('Error:')} ${err.message}\n`);
    }
  } finally {
    rl.close();
  }
}

main();
