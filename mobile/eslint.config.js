const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');
const unusedImports = require('eslint-plugin-unused-imports');
const importPlugin = require('eslint-plugin-import');
const i18next = require('eslint-plugin-i18next');

module.exports = [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'dist/',
      'web-build/',
      'ios/',
      'android/',
      'coverage/',
      'babel.config.js',
      'metro.config.js',
      'commitlint.config.js',
      'eslint.config.js',
      'jest.config.ts',
      'jest.setup.ts',
      'index.ts',
      'scripts/',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        __DEV__: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        jest: 'readonly',
        React: 'readonly',
        Alert: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      'unused-imports': unusedImports,
      import: importPlugin,
      i18next,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: true,
      },
    },
    rules: {
      // ========================================
      // TypeScript: Strict Type Safety
      // ========================================
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': false,
          'ts-nocheck': false,
        },
      ],

      // ========================================
      // Unused Imports
      // ========================================
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // ========================================
      // React Hooks
      // ========================================
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ========================================
      // React Native
      // ========================================
      'react-native/no-inline-styles': 'error',
      'react-native/no-color-literals': 'warn',
      'react-native/no-unused-styles': 'error',
      'react-native/no-single-element-style-arrays': 'error',
      'react-native/split-platform-components': 'warn',

      // ========================================
      // i18n: No Hardcoded Strings
      // ========================================
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-text-only',
          'jsx-components': {
            exclude: ['Trans'],
          },
        },
      ],

      // ========================================
      // Import Ordering
      // ========================================
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': 'warn',

      // ========================================
      // Best Practices
      // ========================================
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      curly: ['error', 'multi-line'],
      eqeqeq: ['error', 'always'],
      'no-throw-literal': 'error',
      'no-return-await': 'error',
      'no-param-reassign': ['error', { props: false }],
      'no-duplicate-imports': 'off', // handled by import/no-duplicates

      // ========================================
      // Code Quality
      // ========================================
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'off', // alerts are valid in RN for user prompts
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-shadow': 'off', // using @typescript-eslint/no-shadow instead
      'no-undef': 'off', // TypeScript handles this
      'no-use-before-define': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in iterates over prototype chain. Use Object.keys() or Object.entries().',
        },
      ],
    },
  },
];
