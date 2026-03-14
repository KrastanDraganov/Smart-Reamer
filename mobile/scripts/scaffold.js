#!/usr/bin/env node

/**
 * Feature Scaffolder
 *
 * Non-interactive feature scaffolder callable by AI agents via CLI arg.
 * Creates the full 7-directory feature structure with boilerplate files.
 *
 * Usage: npm run scaffold -- <feature-name>
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

const c = (color, text) => `${COLORS[color]}${text}${COLORS.reset}`;

function capitalize(str) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
}

function run() {
  const featureName = process.argv[2];

  if (!featureName) {
    console.log(`\n  ${c('red', '✗')} Feature name is required`);
    console.log(`  ${c('dim', 'Usage: npm run scaffold -- <feature-name>')}\n`);
    process.exit(1);
  }

  // Validate feature name
  if (!/^[a-z][a-z0-9-]*$/.test(featureName)) {
    console.log(`\n  ${c('red', '✗')} Invalid feature name: "${featureName}"`);
    console.log(
      `  ${c('dim', 'Use lowercase letters, numbers, and hyphens (e.g. products, user-profile)')}\n`
    );
    process.exit(1);
  }

  const featureDir = path.join(ROOT, 'src', 'features', featureName);

  if (fs.existsSync(featureDir)) {
    console.log(
      `\n  ${c('red', '✗')} Feature "${featureName}" already exists at src/features/${featureName}/\n`
    );
    process.exit(1);
  }

  console.log(`\n  ${c('cyan', 'Scaffolding feature:')} ${c('bold', featureName)}\n`);

  // Create all 7 directories
  const dirs = ['components', 'services', 'hooks', 'types', 'constants', 'stores', 'schemas'];
  dirs.forEach((dir) => {
    fs.mkdirSync(path.join(featureDir, dir), { recursive: true });
  });

  const cap = capitalize(featureName);

  // Types file
  writeFile(
    path.join(featureDir, 'types', `${featureName}.types.ts`),
    `// Types for the ${featureName} feature\n\nexport interface ${cap}Item {\n  id: string;\n  // TODO: Add your fields here\n}\n`
  );

  // Service file
  writeFile(
    path.join(featureDir, 'services', `${featureName}Service.ts`),
    `import { api } from '@/services/api';\nimport type { ${cap}Item } from '../types/${featureName}.types';\n\nexport async function get${cap}List(): Promise<${cap}Item[]> {\n  const response = await api.get('/${featureName}');\n  return response.data;\n}\n\nexport async function get${cap}ById(id: string): Promise<${cap}Item> {\n  const response = await api.get(\`/${featureName}/\${id}\`);\n  return response.data;\n}\n`
  );

  // Hook file
  writeFile(
    path.join(featureDir, 'hooks', `use${cap}.ts`),
    `import { useQuery } from '@tanstack/react-query';\nimport { get${cap}List } from '../services/${featureName}Service';\n\nexport function use${cap}List() {\n  return useQuery({\n    queryKey: ['${featureName}'],\n    queryFn: get${cap}List,\n  });\n}\n`
  );

  // Component file
  writeFile(
    path.join(featureDir, 'components', `${cap}List.tsx`),
    `import { useTranslation } from 'react-i18next';\nimport { View } from 'react-native';\nimport { StyleSheet } from 'react-native-unistyles';\nimport { Text, Loading, EmptyState } from '@/common/components';\nimport { use${cap}List } from '../hooks/use${cap}';\n\nexport function ${cap}List() {\n  const { t } = useTranslation();\n  const { data, isLoading } = use${cap}List();\n\n  if (isLoading) return <Loading />;\n\n  if (!data?.length) {\n    return (\n      <EmptyState\n        icon="folder-open-outline"\n        message={t('${featureName}.empty')}\n      />\n    );\n  }\n\n  return (\n    <View style={styles.container}>\n      <Text variant="h2">{t('${featureName}.title')}</Text>\n      {/* TODO: Render your list items here */}\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create((theme) => ({\n  container: {\n    flex: 1,\n    padding: theme.metrics.spacing.p16,\n    gap: theme.metrics.spacingV.p12,\n  },\n}));\n`
  );

  // Barrel export
  writeFile(
    path.join(featureDir, 'components', 'index.ts'),
    `export { ${cap}List } from './${cap}List';\n`
  );

  // Store placeholder
  writeFile(
    path.join(featureDir, 'stores', 'index.ts'),
    `// Zustand stores for the ${featureName} feature\n`
  );

  // Schema placeholder
  writeFile(
    path.join(featureDir, 'schemas', 'index.ts'),
    `// Zod schemas for the ${featureName} feature\n`
  );

  // Constants placeholder
  writeFile(
    path.join(featureDir, 'constants', 'index.ts'),
    `// Constants for the ${featureName} feature\n`
  );

  // Add i18n keys
  const enPath = path.join(ROOT, 'src', 'i18n', 'locales', 'en.json');
  const arPath = path.join(ROOT, 'src', 'i18n', 'locales', 'ar.json');

  if (fs.existsSync(enPath)) {
    const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    en[featureName] = {
      title: cap,
      empty: `No ${featureName} found`,
    };
    fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
    console.log(`  ${c('green', '✓')} Added i18n keys to en.json`);
  }

  if (fs.existsSync(arPath)) {
    const ar = JSON.parse(fs.readFileSync(arPath, 'utf-8'));
    ar[featureName] = {
      title: cap,
      empty: `لا يوجد ${featureName}`,
    };
    fs.writeFileSync(arPath, JSON.stringify(ar, null, 2) + '\n');
    console.log(`  ${c('green', '✓')} Added i18n keys to ar.json`);
  }

  console.log(`  ${c('green', '✓')} Feature "${featureName}" scaffolded:`);
  console.log(c('dim', `      src/features/${featureName}/`));
  console.log(c('dim', `      ├── components/${cap}List.tsx`));
  console.log(c('dim', `      ├── hooks/use${cap}.ts`));
  console.log(c('dim', `      ├── services/${featureName}Service.ts`));
  console.log(c('dim', `      ├── types/${featureName}.types.ts`));
  console.log(c('dim', `      ├── constants/`));
  console.log(c('dim', `      ├── stores/`));
  console.log(c('dim', `      └── schemas/`));
  console.log('');
}

run();
