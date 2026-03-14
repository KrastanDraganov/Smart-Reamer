# Architecture

## Overview

This is a production-grade React Native Expo template designed as a reusable foundation for all future mobile applications. It includes authentication, theming, internationalization, API integration, and testing infrastructure out of the box.

## Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Framework    | React Native 0.83.2 + Expo SDK 55               |
| Routing      | expo-router (file-based, typed routes)          |
| Language     | TypeScript 5.9 (strict)                         |
| Styling      | react-native-unistyles 3.x                      |
| Server State | @tanstack/react-query + MMKV persistence        |
| Client State | Zustand                                         |
| Backend      | Supabase (graceful degradation if unconfigured) |
| API Client   | Axios with auth interceptors                    |
| i18n         | react-i18next (EN/AR, RTL support)              |
| Storage      | react-native-mmkv                               |
| Forms        | react-hook-form + Zod                           |
| Testing      | Jest + jest-expo                                |
| Linting      | ESLint 9 flat config                            |

## Directory Structure

```
src/
├── common/components/     # Shared UI: Button, Card, Icon, Input, ErrorBoundary, ScreenContainer, Loading, EmptyState
├── config/                # Centralized env config with validation
├── features/              # Feature modules (auth, settings, etc.)
│   └── <feature>/
│       ├── components/
│       ├── services/
│       ├── hooks/
│       ├── stores/
│       └── types/
├── hooks/                 # Global hooks: useBottomPadding, useNetworkStatus, useScreenDimensions, useProtectedRoute
├── i18n/                  # Translation files and config
├── integrations/          # Third-party clients (Supabase)
├── providers/             # React Query provider, auth store
├── services/api/          # Axios API client with interceptors
├── theme/                 # Semantic color tokens, metrics, fonts
├── types/                 # Global TypeScript types
└── utils/storage/         # MMKV with typed storage keys

app/                       # Expo Router file-based routing
├── _layout.tsx            # Root: GestureHandler > ErrorBoundary > QueryProvider > BottomSheet > App
├── +not-found.tsx
└── (main)/(tabs)/         # Tab navigation (Home + Settings)
```

## Key Patterns

### Graceful Supabase Init

The app boots and functions even without Supabase environment variables configured. A warning is logged in dev, and auth features simply won't activate.

### Auth via Zustand (No Provider Wrapper)

Authentication state is managed by a Zustand store (`useAuthStore`) with a `useAuthInit()` hook called in the root layout. No React context provider needed.

### ErrorBoundary

Wraps the entire app. Catches React rendering errors, shows a recovery UI, and exposes an `onError` callback for crash reporting (Sentry-ready).

### API Client

Axios instance with request interceptor for auth tokens and response interceptor for 401 auto-logout and error normalization.

### Theme System

Two pre-registered themes (light/dark) with semantic color tokens. Uses react-native-unistyles for flicker-free theme switching at startup.

### Route Protection

`useProtectedRoute` hook monitors auth state and expo-router segments to redirect unauthenticated users to login.

## Adding a New Feature

1. Create `src/features/<name>/` with components, services, hooks, stores, types subdirectories as needed
2. Add route files in `app/` directory
3. Add translation keys to `en.json` and `ar.json`
4. Export shared hooks from `src/hooks/index.ts`

## Adding a New Tab

1. Create a new file in `app/(main)/(tabs)/` (e.g., `explore.tsx`)
2. Add a `Tabs.Screen` entry in `app/(main)/(tabs)/_layout.tsx`
3. Add the tab name translation key to both locale files
