# Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npx expo`)
- iOS Simulator (macOS) or Android Emulator

## Quick Start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Copy environment file
cp .env.example .env

# 3. Start the dev server
npm start
```

The app works without Supabase configuration. Auth features activate once you add valid credentials to `.env`.

## Environment Variables

| Variable                             | Required | Description                                                |
| ------------------------------------ | -------- | ---------------------------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`           | No       | Supabase project URL                                       |
| `EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY` | No       | Supabase anon key                                          |
| `EXPO_PUBLIC_API_BASE_URL`           | No       | Base URL for API client (default: https://api.example.com) |
| `EXPO_PUBLIC_SENTRY_DSN`             | No       | Sentry DSN for crash reporting                             |
| `EXPO_PUBLIC_APP_ENV`                | No       | Environment: development, staging, production              |

## Customization Checklist

When starting a new project from this template:

1. **`app.json`** - Update `name`, `slug`, `bundleIdentifier`, and `package`
2. **`package.json`** - Update `name`
3. **`.env`** - Add your environment variables
4. **Theme** - Modify `src/theme/light-theme.ts` and `dark-theme.ts` to match your brand
5. **Translations** - Update `src/i18n/locales/` with your app's strings
6. **Storage keys** - Add domain-specific keys to `src/utils/storage/constants.ts`
7. **Tabs** - Add/modify tabs in `app/(main)/(tabs)/`

## Scripts

```bash
npm start              # Start Expo dev server
npm run ios            # Run on iOS
npm run android        # Run on Android
npm run type-check     # TypeScript checking
npm run lint           # ESLint
npm run lint:fix       # Auto-fix lint errors
npm run format         # Prettier format
npm run validate       # All checks (type-check + lint + format)
npm test               # Run tests
npm run test:coverage  # Test coverage report
```

## EAS Build

```bash
# Development build (simulator)
eas build --profile development --platform ios

# Preview build (internal testing)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all
```
