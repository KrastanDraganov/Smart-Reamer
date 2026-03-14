# Migration Guide: React Native Expo Base Template

**Audience:** AI coding agents (Claude Code, Cursor, Cline, Copilot, etc.)

**Purpose:** This guide gives you a precise, mechanical procedure to transform this base template into a specific application. When a user says "I want to build an e-commerce app" or "I want to build a game hub" or "I want to build a social media app", follow this guide from top to bottom in sequence.

**Template version:** React Native 0.83.2 / Expo SDK 55 / TypeScript 5.9

---

## Table of Contents

1. [Pre-Migration Checklist](#1-pre-migration-checklist)
2. [App Identity](#2-app-identity)
3. [Theme Customization](#3-theme-customization)
4. [Internationalization](#4-internationalization)
5. [Backend Configuration](#5-backend-configuration)
6. [Authentication Customization](#6-authentication-customization)
7. [Navigation Structure](#7-navigation-structure)
8. [Creating Your First Feature](#8-creating-your-first-feature)
9. [State Management Patterns](#9-state-management-patterns)
10. [Deployment](#10-deployment)
11. [Final Verification Checklist](#11-final-verification-checklist)

---

## 1. Pre-Migration Checklist

Complete every item before making any code changes.

### 1.1 Verify Clean State

Confirm the project compiles with zero errors:

```bash
npm run validate
```

`validate` runs three checks in sequence: `type-check`, `lint`, and `format:check`. All three must pass before proceeding. If any fail, fix the reported issues first.

### 1.2 Confirm Dev Server Starts

```bash
npm start
```

The Expo Metro bundler must start without errors. Press `i` for iOS simulator or `a` for Android emulator to confirm the app renders. Then stop the server (`Ctrl+C`) and proceed.

---

## 2. App Identity

Replace every placeholder value that identifies the template. The template ships with the name "My App" and the bundle ID `com.myapp.app`. Both must change before any real development.

### 2.1 `app.json`

**File:** `app.json`

This is the Expo configuration manifest. Every value shown below must be replaced.

**Before:**

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "scheme": "my-app",
    "ios": {
      "bundleIdentifier": "com.myapp.app"
    },
    "android": {
      "package": "com.myapp.app",
      "adaptiveIcon": {
        "backgroundColor": "#0F172A"
      }
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#0F172A",
          "dark": {
            "backgroundColor": "#020617"
          }
        }
      ]
    ]
  }
}
```

**After (example: building "ShopNow" e-commerce app):**

```json
{
  "expo": {
    "name": "ShopNow",
    "slug": "shopnow",
    "scheme": "shopnow",
    "ios": {
      "bundleIdentifier": "com.yourcompany.shopnow"
    },
    "android": {
      "package": "com.yourcompany.shopnow",
      "adaptiveIcon": {
        "backgroundColor": "#FF6B35"
      }
    },
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#FF6B35",
          "dark": {
            "backgroundColor": "#1A0A00"
          }
        }
      ]
    ]
  }
}
```

Field-by-field rules:

- `name`: The human-readable display name shown on the device home screen.
- `slug`: URL-safe lowercase identifier used by Expo services. No spaces or special characters.
- `scheme`: Deep link URL scheme (e.g., `shopnow://`). Must be lowercase, no hyphens.
- `bundleIdentifier` (iOS): Reverse-domain notation. Must match your Apple Developer account.
- `package` (Android): Reverse-domain notation. Must match your Google Play Console entry.
- `backgroundColor` (splash + adaptive icon): Should match your brand primary color.

### 2.2 `package.json`

**File:** `package.json`

Change only the `name` field. Leave all dependencies untouched.

**Before:**

```json
{
  "name": "rncopilot"
}
```

**After:**

```json
{
  "name": "shopnow"
}
```

The `name` field must be lowercase and URL-safe. It is used internally by npm and Node.js module resolution.

### 2.3 Replace Assets

All image assets live in `assets/images/`. Replace every file in place, keeping the exact same filenames so `app.json` references remain valid.

- [ ] Replace `icon.png` — 1024x1024 px, PNG with transparency
- [ ] Replace `splash-icon.png` — your logo centered, PNG with transparency
- [ ] Replace `adaptive-icon.png` — Android adaptive icon foreground, 1024x1024 px
- [ ] Replace `favicon.png` — 48x48 px for web

> **Common Mistake:** Changing asset filenames and forgetting to update `app.json`. Always keep filenames identical when replacing assets.

---

## 3. Theme Customization

The theme system uses react-native-unistyles 3.x with semantic color tokens. All colors flow through theme objects — there are no hard-coded color literals in components.

### 3.1 Light Theme Colors

**File:** `src/theme/light-theme.ts`

This file exports `lightColors` which is the single source of truth for all light-mode colors.

**Before (template defaults — Indigo primary, Teal accent):**

```typescript
export const lightColors: ThemeColors = {
  mode: 'light',
  brand: {
    primary: '#6366F1', // Indigo
    secondary: '#1E293B', // Deep Slate
    tertiary: '#14B8A6', // Teal accent
    primaryVariant: '#4F46E5',
    secondaryVariant: '#334155',
  },
  // ...
  text: {
    accent: '#14B8A6',
    link: '#6366F1',
    linkHover: '#4F46E5',
  },
  border: {
    focus: '#6366F1',
  },
  icon: {
    primary: '#6366F1',
    accent: '#14B8A6',
  },
  overlay: {
    pressed: 'rgba(99, 102, 241, 0.12)',
    hover: 'rgba(99, 102, 241, 0.08)',
    focus: 'rgba(99, 102, 241, 0.15)',
  },
  gradient: {
    primary: ['#4F46E5', '#6366F1'],
    secondary: ['#6366F1', '#818CF8'],
    accent: ['#0D9488', '#14B8A6'],
  },
};
```

**After (example: e-commerce app with Orange primary, Blue accent):**

```typescript
export const lightColors: ThemeColors = {
  mode: 'light',
  brand: {
    primary: '#FF6B35', // Orange
    secondary: '#1A1A2E', // Deep Navy
    tertiary: '#0099CC', // Blue accent
    primaryVariant: '#E55A24',
    secondaryVariant: '#2D2D44',
  },
  background: {
    app: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F3F5',
    section: '#FFF4EF', // Tinted with primary
    elevated: '#FFFFFF',
    input: '#F1F3F5',
    disabled: '#E9ECEF',
    modal: '#FFFFFF',
  },
  text: {
    primary: '#1A1A2E',
    secondary: '#343A40',
    tertiary: '#6C757D',
    muted: '#ADB5BD',
    inverse: '#FFFFFF',
    accent: '#0099CC', // Matches tertiary
    link: '#FF6B35', // Matches primary
    linkHover: '#E55A24', // Matches primaryVariant
  },
  border: {
    default: '#DEE2E6',
    subtle: '#F1F3F5',
    strong: '#CED4DA',
    focus: '#FF6B35', // Matches primary
    disabled: '#DEE2E6',
  },
  icon: {
    primary: '#FF6B35', // Matches primary
    secondary: '#1A1A2E',
    tertiary: '#ADB5BD',
    muted: '#CED4DA',
    inverse: '#FFFFFF',
    accent: '#0099CC', // Matches tertiary
  },
  state: {
    success: '#10B981',
    successBg: '#ECFDF5',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.12)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.12)',
    disabled: '#CED4DA',
  },
  overlay: {
    modal: 'rgba(0, 0, 0, 0.5)',
    pressed: 'rgba(255, 107, 53, 0.12)', // Primary with opacity
    hover: 'rgba(255, 107, 53, 0.08)',
    focus: 'rgba(255, 107, 53, 0.15)',
    ripple: 'rgba(255, 255, 255, 0.25)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  gradient: {
    primary: ['#E55A24', '#FF6B35'],
    secondary: ['#FF6B35', '#FF8C69'],
    accent: ['#0077AA', '#0099CC'],
    success: ['#059669', '#34D399'],
    highlight: ['#CC0066', '#FF4499'],
  },
  shadow: {
    color: 'rgba(0, 0, 0, 0.1)',
    elevation: 4,
    elevationSmall: 2,
    elevationMedium: 4,
    elevationLarge: 8,
  },
};
```

**Rule for overlay colors:** The `pressed`, `hover`, and `focus` overlay values must be the primary brand color converted to rgba with the opacity values 0.12, 0.08, and 0.15 respectively.

### 3.2 Dark Theme Colors

**File:** `src/theme/dark-theme.ts`

The dark theme uses lighter, more saturated variants of brand colors so they remain visible against dark backgrounds.

**Conversion rules from light to dark:**

- `brand.primary`: Lighten by ~20% (add brightness, reduce saturation slightly)
- `brand.tertiary`: Increase brightness significantly
- `background.*`: Use dark slate colors (`#0F172A`, `#1E293B`) and rgba whites
- `text.primary`: Near-white (`#F1F5F9`)
- All `overlay.*` colors: Use the dark-mode primary color in rgba

**After (example: dark mode for the Orange/Blue e-commerce theme):**

```typescript
export const darkColors: ThemeColors = {
  mode: 'dark',
  brand: {
    primary: '#FF8C69', // Lighter orange for dark bg
    secondary: '#CBD5E1',
    tertiary: '#33BBEE', // Brighter blue for dark bg
    primaryVariant: '#FFA07A',
    secondaryVariant: '#E2E8F0',
  },
  background: {
    app: '#0F1117',
    surface: 'rgba(255, 255, 255, 0.06)',
    surfaceAlt: 'rgba(255, 255, 255, 0.10)',
    section: '#1A1A2E',
    elevated: 'rgba(255, 255, 255, 0.12)',
    input: 'rgba(255, 255, 255, 0.08)',
    disabled: 'rgba(255, 255, 255, 0.05)',
    modal: '#1A1A2E',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#CBD5E1',
    tertiary: '#94A3B8',
    muted: '#64748B',
    inverse: '#0F1117',
    accent: '#33BBEE',
    link: '#FF8C69',
    linkHover: '#FFA07A',
  },
  border: {
    default: 'rgba(255, 255, 255, 0.12)',
    subtle: 'rgba(255, 255, 255, 0.06)',
    strong: 'rgba(255, 255, 255, 0.2)',
    focus: '#FF8C69',
    disabled: 'rgba(255, 255, 255, 0.05)',
  },
  icon: {
    primary: '#FF8C69',
    secondary: '#CBD5E1',
    tertiary: '#64748B',
    muted: '#475569',
    inverse: '#0F1117',
    accent: '#33BBEE',
  },
  state: {
    success: 'rgba(52, 211, 153, 0.8)',
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#FBBF24',
    warningBg: 'rgba(251, 191, 36, 0.2)',
    error: '#F87171',
    errorBg: 'rgba(248, 113, 113, 0.2)',
    info: '#60A5FA',
    infoBg: 'rgba(96, 165, 250, 0.2)',
    disabled: '#475569',
  },
  overlay: {
    modal: 'rgba(0, 0, 0, 0.7)',
    pressed: 'rgba(255, 140, 105, 0.15)',
    hover: 'rgba(255, 140, 105, 0.08)',
    focus: 'rgba(255, 140, 105, 0.2)',
    ripple: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
  gradient: {
    primary: ['#1A1A2E', '#FF8C69'],
    secondary: ['#FF8C69', '#FFA07A'],
    accent: ['#0077AA', '#33BBEE'],
    success: ['#059669', '#34D399'],
    highlight: ['#6D28D9', '#A78BFA'],
  },
  shadow: {
    color: 'rgba(0, 0, 0, 0.5)',
    elevation: 6,
    elevationSmall: 2,
    elevationMedium: 6,
    elevationLarge: 12,
  },
};
```

### 3.3 Theme Config (Adding Named Presets)

**File:** `src/theme/config.ts`

The template ships with one preset named `'default'`. If your app supports multiple brand themes (e.g., a white-label product), add presets here.

**Before (single preset):**

```typescript
export type ThemePresetName = 'default';

export const THEME_PRESET_NAMES: ThemePresetName[] = ['default'];

export const THEME_METADATA: Record<
  ThemePresetName,
  { name: string; description: string; baseColor: string }
> = {
  default: {
    name: 'Default',
    description: 'Modern indigo theme',
    baseColor: '#6366F1',
  },
};
```

**After (multiple presets — only if your app truly needs it):**

```typescript
export type ThemePresetName = 'default' | 'ocean' | 'forest';

export const THEME_PRESET_NAMES: ThemePresetName[] = ['default', 'ocean', 'forest'];

export const THEME_METADATA: Record<
  ThemePresetName,
  { name: string; description: string; baseColor: string }
> = {
  default: {
    name: 'Signature',
    description: 'The main brand theme',
    baseColor: '#FF6B35',
  },
  ocean: {
    name: 'Ocean',
    description: 'Cool blue tones',
    baseColor: '#0099CC',
  },
  forest: {
    name: 'Forest',
    description: 'Earthy green tones',
    baseColor: '#2D6A4F',
  },
};
```

If you add presets, you must also update `buildAllThemes()` in the same file to build theme objects for each new preset, and create corresponding color objects.

For most apps, leave this file unchanged.

### 3.4 Custom Fonts

**File:** `src/theme/fonts.ts`

The template uses the system font. To use a custom font:

- [ ] Step 1: Add font files to `assets/fonts/`
- [ ] Step 2: Register fonts in `app.json`:

```json
"plugins": [
  [
    "expo-font",
    {
      "fonts": [
        "./assets/fonts/Inter-Regular.ttf",
        "./assets/fonts/Inter-Medium.ttf",
        "./assets/fonts/Inter-SemiBold.ttf",
        "./assets/fonts/Inter-Bold.ttf",
        "./assets/fonts/Inter-Light.ttf"
      ]
    }
  ]
]
```

- [ ] Step 3: Update `src/theme/fonts.ts`:

**Before:**

```typescript
export const FONTS = {
  regular: 'System',
  bold: 'System',
  semiBold: 'System',
  light: 'System',
  medium: 'System',
};
```

**After:**

```typescript
export const FONTS = {
  regular: 'Inter-Regular',
  bold: 'Inter-Bold',
  semiBold: 'Inter-SemiBold',
  light: 'Inter-Light',
  medium: 'Inter-Medium',
};
```

The font family string must exactly match the PostScript name embedded in the font file, not the filename.

> **Common Mistake:** Using the filename instead of the PostScript name. If fonts are not rendering, open the font file in Font Book (macOS) to find the exact PostScript name.

---

## 4. Internationalization

The i18n system uses react-i18next with JSON translation files. The template ships with English and Arabic including RTL support.

### 4.1 Update English Translations

**File:** `src/i18n/locales/en.json`

Remove showcase-specific keys and add your app-specific keys. Keep all keys that map to shared UI (`common`, `auth`, `settings`, `errorBoundary`, `network`, `notFound`, `errors`, `validation`).

**Remove the entire `showcase` section** and replace the `home` and `tabs` sections with your app content:

```json
{
  "common": {
    "loading": "Loading...",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next",
    "done": "Done",
    "retry": "Retry",
    "search": "Search",
    "settings": "Settings",
    "close": "Close",
    "edit": "Edit",
    "submit": "Submit",
    "ok": "OK"
  },
  "tabs": {
    "home": "Home",
    "products": "Products",
    "cart": "Cart",
    "profile": "Profile",
    "settings": "Settings"
  },
  "home": {
    "welcome": "Welcome back",
    "subtitle": "What are you shopping for today?"
  },
  "products": {
    "title": "Products",
    "empty": "No products found",
    "emptyMessage": "Try adjusting your search or filters",
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock",
    "price": "Price",
    "category": "Category",
    "filter": "Filter",
    "sort": "Sort"
  },
  "cart": {
    "title": "Your Cart",
    "empty": "Your cart is empty",
    "emptyMessage": "Start shopping to add items",
    "checkout": "Checkout",
    "total": "Total",
    "remove": "Remove"
  },
  "auth": {},
  "settings": {},
  "errorBoundary": {},
  "network": {},
  "notFound": {},
  "errors": {},
  "validation": {}
}
```

### 4.2 Update Arabic Translations

**File:** `src/i18n/locales/ar.json`

Mirror the exact same key structure as `en.json`. Every key present in `en.json` must exist in `ar.json` or the TypeScript type system will error (the `en.json` type is used as the reference via `CustomTypeOptions`).

### 4.3 Add a New Language (e.g., French)

- [ ] Step 1: Create the translation file:
      `src/i18n/locales/fr.json`
      Copy `en.json` as a starting point and translate all values.

- [ ] Step 2: Update `src/i18n/config.ts`:

**Before:**

```typescript
import ar from './locales/ar.json';
import en from './locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLang,
  fallbackLng: 'en',
});
```

**After:**

```typescript
import ar from './locales/ar.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    fr: { translation: fr },
  },
  lng: initialLang,
  fallbackLng: 'en',
});
```

- [ ] Step 3: Update the device locale detection in `src/i18n/config.ts` to handle the new locale:

```typescript
const deviceLocale = getLocales()[0]?.languageCode;
if (deviceLocale === 'ar') {
  initialLang = 'ar';
} else if (deviceLocale === 'fr') {
  initialLang = 'fr';
}
```

- [ ] Step 4: Update `app.json` to declare the new locale:

```json
"ios": {
  "infoPlist": {
    "CFBundleLocalizations": ["en", "ar", "fr"]
  }
},
"plugins": [
  [
    "expo-localization",
    {
      "supportedLocales": {
        "ios": ["en", "ar", "fr"],
        "android": ["en", "ar", "fr"]
      }
    }
  ]
]
```

### 4.4 Remove Arabic and RTL Support

If your app does not need Arabic or RTL:

- [ ] Step 1: Delete `src/i18n/locales/ar.json`

- [ ] Step 2: Remove the Arabic resource from `src/i18n/config.ts`:

```typescript
// Remove this import:
// import ar from './locales/ar.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    // Remove: ar: { translation: ar },
  },
});
```

- [ ] Step 3: Remove the RTL logic from `app/_layout.tsx`:

```typescript
// Remove these lines:
// const isArabic = i18n.language === 'ar';
// if (Platform.OS !== 'web') {
//   I18nManager.allowRTL(isArabic);
//   I18nManager.forceRTL(isArabic);
// }
```

- [ ] Step 4: Update `app.json` to remove Arabic from `CFBundleLocalizations` and `supportedLocales`.

- [ ] Step 5: Set `"supportsRTL": false` in `app.json`.

---

## 5. Backend Configuration

### 5.1 Configure Supabase

- [ ] Step 1: Copy the environment template:

```bash
cp .env.example .env
```

- [ ] Step 2: Fill in your Supabase project credentials in `.env`:

**File:** `.env`

```bash
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmn.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_API_BASE_URL=https://api.yourapp.com
EXPO_PUBLIC_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/789
EXPO_PUBLIC_APP_ENV=development
```

> **Common Mistake:** Committing `.env` to git. Verify `.gitignore` contains `.env` (it does in this template). Never commit real credentials.

The Supabase client at `src/integrations/supabase.ts` reads these values through `src/config/env.ts`. If either credential is missing, Supabase initializes as `null` and the app boots normally without auth features — this is intentional graceful degradation.

### 5.2 Add New Environment Variables

**File:** `src/config/env.ts`

When your app needs additional configuration values (Stripe keys, analytics IDs, feature flags), add them here:

```typescript
interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
  sentryDsn: string;
  appEnv: 'development' | 'staging' | 'production';
  isDev: boolean;
  isProd: boolean;
  // Add your new variables:
  stripePublishableKey: string;
  analyticsKey: string;
  featureFlagEndpoint: string;
}

export const env: EnvConfig = {
  // ... existing values ...
  stripePublishableKey: getEnvVar('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  analyticsKey: getEnvVar('EXPO_PUBLIC_ANALYTICS_KEY'),
  featureFlagEndpoint: getEnvVar('EXPO_PUBLIC_FEATURE_FLAG_ENDPOINT', 'https://flags.example.com'),
};
```

Then add the corresponding keys to `.env` and `.env.example`.

### 5.3 Configure the Axios API Client

**File:** `src/services/api/client.ts`

The API client ships with:

- 15 second timeout
- `Content-Type: application/json`
- Automatic Bearer token injection from `useAuthStore`
- 401 → automatic session clear

To customize:

```typescript
const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30000, // Increase for slower APIs
  headers: {
    'Content-Type': 'application/json',
    'X-App-Version': '1.0.0', // Custom headers
    'X-Platform': Platform.OS,
  },
});
```

To add a custom token format (if not using Supabase Bearer tokens):

```typescript
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const session = useAuthStore.getState().session;
  if (session?.access_token) {
    // Change Bearer to your scheme:
    config.headers.Authorization = `Token ${session.access_token}`;
    // Or use API key header:
    config.headers['X-API-Key'] = session.access_token;
  }
  return config;
});
```

### 5.4 Switch from Supabase to a Different Backend

If you are not using Supabase (e.g., using a custom REST API, Firebase, or AWS Amplify):

- [ ] Step 1: Remove Supabase env vars from `.env` and `.env.example`.

- [ ] Step 2: Update `src/integrations/supabase.ts` — replace the file with a stub or delete it if unused:

```typescript
// src/integrations/supabase.ts - stub when not using Supabase
export const supabase = null;
```

- [ ] Step 3: Replace `src/features/auth/services/authService.ts` with calls to your own API:

```typescript
import { api } from '@/services/api/client';

export async function login({ email, password }: LoginParams) {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // { user, token }
}

export async function register({ email, password, username }: RegisterParams) {
  const response = await api.post('/auth/register', { email, password, username });
  return response.data;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function getSession() {
  const response = await api.get('/auth/me');
  return { session: response.data };
}
```

- [ ] Step 4: Update `src/providers/auth/authStore.ts` to remove the `supabase.auth.onAuthStateChange` listener and replace session type from Supabase's `Session` to your own session interface.

---

## 6. Authentication Customization

### 6.1 Modify Auth State Shape

**File:** `src/providers/auth/authStore.ts`

The template's `AuthState` uses Supabase's `User` and `Session` types. To extend with app-specific user data:

```typescript
import type { User, Session } from '@supabase/supabase-js';

// Add your app-specific user profile type:
interface UserProfile {
  displayName: string;
  avatarUrl: string | null;
  role: 'customer' | 'admin';
  isPremium: boolean;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null; // Add this
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void; // Add this
  setLoading: (isLoading: boolean) => void;
  clearSession: () => void;
  initialize: () => Promise<void>;
  cleanup: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  // ...
  setProfile: (profile) => set({ profile }),
  clearSession: () => {
    set({ user: null, session: null, profile: null, isAuthenticated: false });
  },
}));
```

### 6.2 Customize Auth Forms

**Directory:** `src/features/auth/`

Structure:

```
src/features/auth/
├── components/
│   ├── LoginForm/
│   └── RegisterForm/
├── services/
│   └── authService.ts
├── hooks/
├── schemas/
│   ├── loginSchema.ts
│   └── registerSchema.ts
└── constants/
```

To add a phone number field to the registration form:

- [ ] Step 1: Update the schema at `src/features/auth/schemas/registerSchema.ts`:

```typescript
import { z } from 'zod/v4';

export const registerSchema = z
  .object({
    email: z.email('validation.emailInvalid'),
    password: z.string().min(8, 'validation.passwordMin'),
    confirmPassword: z.string(),
    username: z.string().min(3, 'validation.usernameMin').max(20, 'validation.usernameMax'),
    phone: z
      .string()
      .regex(/^\+\d{10,15}$/, 'validation.phoneInvalid')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
```

- [ ] Step 2: Add the validation message to `src/i18n/locales/en.json`:

```json
"validation": {
  "phoneInvalid": "Please enter a valid phone number with country code"
}
```

### 6.3 Add Social Auth (Google and Apple)

- [ ] Step 1: Install dependencies:

```bash
npx expo install expo-auth-session expo-crypto
```

- [ ] Step 2: Add to `src/features/auth/services/authService.ts`:

```typescript
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'yourapp://auth/callback',
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithApple() {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken!,
  });

  if (error) throw error;
  return data;
}
```

- [ ] Step 3: Enable Google and Apple providers in your Supabase dashboard under Authentication > Providers.

### 6.4 Add Forgot Password Flow

- [ ] Step 1: Add service function to `src/features/auth/services/authService.ts`:

```typescript
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'yourapp://auth/reset-password',
  });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
}
```

- [ ] Step 2: Create screen at `app/(auth)/forgot-password.tsx`
- [ ] Step 3: Create screen at `app/(auth)/reset-password.tsx`
- [ ] Step 4: Add the schema at `src/features/auth/schemas/forgotPasswordSchema.ts`:

```typescript
import { z } from 'zod/v4';

export const forgotPasswordSchema = z.object({
  email: z.email('validation.emailInvalid'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
```

### 6.5 Add Email Verification

Supabase sends a verification email automatically on `signUp`. To handle the confirmation flow:

- [ ] Step 1: Configure the redirect URL in your Supabase project dashboard.
- [ ] Step 2: Add a deep link handler in `app/(auth)/confirm.tsx`:

```typescript
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase';

export default function ConfirmScreen() {
  const { token_hash, type } = useLocalSearchParams<{
    token_hash: string;
    type: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    if (token_hash && type) {
      supabase.auth.verifyOtp({ token_hash, type: type as 'email' }).then(({ error }) => {
        if (!error) router.replace('/(main)/(tabs)');
      });
    }
  }, [token_hash, type, router]);

  return null; // Show a loading indicator
}
```

---

## 7. Navigation Structure

The app uses expo-router with file-system based routing. The structure is:

```
app/
├── _layout.tsx              # Root layout — providers, auth init
├── +not-found.tsx           # 404 screen
└── (main)/
    ├── _layout.tsx          # Main group layout
    └── (tabs)/
        ├── _layout.tsx      # Tab bar configuration
        ├── index.tsx        # Home tab (name="index")
        └── settings.tsx     # Settings tab
```

### 7.1 Add a New Tab

**Step-by-step: Adding a "Products" tab**

- [ ] Step 1: Create the screen file:

**File:** `app/(main)/(tabs)/products.tsx`

```typescript
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';

export default function ProductsScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <Text variant="heading1">{t('products.title')}</Text>
    </ScreenContainer>
  );
}
```

- [ ] Step 2: Register the tab in the layout:

**File:** `app/(main)/(tabs)/_layout.tsx`

```typescript
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUnistyles } from 'react-native-unistyles';

export default function TabLayout() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand.primary,
        tabBarInactiveTintColor: theme.colors.icon.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.background.surface,
          borderTopColor: theme.colors.border.subtle,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t('tabs.products'),
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

- [ ] Step 3: Add the translation key to `src/i18n/locales/en.json`:

```json
"tabs": {
  "home": "Home",
  "products": "Products",
  "settings": "Settings"
}
```

### 7.2 Add Stack Screens Within a Tab

To add a product detail screen reachable from the Products tab:

- [ ] Step 1: Create a folder for the tab group if needed, or add the screen file:

**File:** `app/(main)/(tabs)/products/[id].tsx`

```typescript
import { useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScreenContainer>
      <Text variant="heading1">Product {id}</Text>
    </ScreenContainer>
  );
}
```

- [ ] Step 2: The tab index screen becomes `products/index.tsx` — rename the flat `products.tsx` to `products/index.tsx` when you create the detail screen.

- [ ] Step 3: Navigate to the detail screen from a product list:

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push(`/(main)/(tabs)/products/${productId}`);
```

### 7.3 Add Auth Screens

Auth screens should live outside the `(main)` group so they are accessible before authentication.

- [ ] Step 1: Create the auth group:

**File:** `app/(auth)/_layout.tsx`

```typescript
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
```

**File:** `app/(auth)/login.tsx`

```typescript
import { useRouter } from 'expo-router';
import { LoginForm } from '@/features/auth/components';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <LoginForm
      onSuccess={() => router.replace('/(main)/(tabs)')}
    />
  );
}
```

- [ ] Step 2: Register the auth group in the root layout:

**File:** `app/_layout.tsx`

```typescript
function RootNavigator() {
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background.app },
      }}
    >
      <Stack.Screen name="(main)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
```

- [ ] Step 3: Add route protection in the `useProtectedRoute` hook or directly in the root layout using `useAuthStore`:

```typescript
function RootNavigator() {
  const { theme } = useUnistyles();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <LoadingScreen />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(main)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
```

### 7.4 Configure Deep Linking

Deep linking is pre-configured via the `scheme` field in `app.json`. To handle specific paths:

**File:** `app.json`

```json
"expo": {
  "scheme": "shopnow",
  "extra": {
    "router": {
      "origin": "https://shopnow.com"
    }
  }
}
```

expo-router automatically maps file paths to URLs. The route `app/(main)/(tabs)/products/[id].tsx` is reachable at:

- Deep link: `shopnow://products/123`
- Universal link: `https://shopnow.com/products/123`

---

## 8. Creating Your First Feature

This section shows the complete implementation of a "Products" feature as a reference pattern. Every feature module you create should follow this exact structure.

### 8.1 Create the Type Definitions

**File:** `src/features/products/types/product.types.ts`

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string | null;
  category: ProductCategory;
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sortBy?: 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}
```

Create the index file:

**File:** `src/features/products/types/index.ts`

```typescript
export type {
  Product,
  ProductCategory,
  ProductListParams,
  ProductListResponse,
} from './product.types';
```

### 8.2 Create the Service

**File:** `src/features/products/services/productService.ts`

```typescript
import { api } from '@/services/api/client';
import type { Product, ProductListParams, ProductListResponse } from '../types';

export async function getProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
  const response = await api.get<ProductListResponse>('/products', { params });
  return response.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const response = await api.get<Product[]>('/products/search', {
    params: { q: query },
  });
  return response.data;
}
```

### 8.3 Create the React Query Hooks

**File:** `src/features/products/hooks/useProducts.ts`

```typescript
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getProductById, getProducts, searchProducts } from '../services/productService';
import type { ProductListParams } from '../types';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductListParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => searchProducts(query),
    enabled: query.length >= 2,
  });
}

export function useInfiniteProducts(params: Omit<ProductListParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: productKeys.list(params),
    queryFn: ({ pageParam }) => getProducts({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
  });
}
```

### 8.4 Create the ProductCard Component

**File:** `src/features/products/components/ProductCard/ProductCard.types.ts`

```typescript
import type { Product } from '../../types';

export interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}
```

**File:** `src/features/products/components/ProductCard/ProductCard.styles.ts`

```typescript
import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.metrics.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
    marginBottom: theme.metrics.spacing.p12,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: theme.colors.background.surfaceAlt,
  },
  content: {
    padding: theme.metrics.spacing.p16,
  },
  name: {
    marginBottom: theme.metrics.spacing.p4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.metrics.spacing.p12,
  },
  price: {
    color: theme.colors.brand.primary,
  },
}));
```

**File:** `src/features/products/components/ProductCard/ProductCard.tsx`

```typescript
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@/common/components/Button';
import { Text } from '@/common/components/Text';
import { styles } from './ProductCard.styles';
import type { ProductCardProps } from './ProductCard.types';

export function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <Pressable style={styles.container} onPress={() => onPress(product)}>
      {product.imageUrl && (
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
      )}
      <View style={styles.content}>
        <Text variant="subtitle" style={styles.name}>
          {product.name}
        </Text>
        <Text variant="body" color="secondary" numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.footer}>
          <Text variant="subtitle" style={styles.price}>
            {product.currency} {product.price.toFixed(2)}
          </Text>
          {onAddToCart && product.stock > 0 && (
            <Button
              size="small"
              variant="primary"
              label={t('products.addToCart')}
              onPress={() => onAddToCart(product)}
            />
          )}
          {product.stock === 0 && (
            <Text variant="caption" color="muted">
              {t('products.outOfStock')}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
```

**File:** `src/features/products/components/ProductCard/index.ts`

```typescript
export { ProductCard } from './ProductCard';
export type { ProductCardProps } from './ProductCard.types';
```

**File:** `src/features/products/components/index.ts`

```typescript
export { ProductCard } from './ProductCard';
```

### 8.5 Create the Zod Schema

**File:** `src/features/products/schemas/productSchema.ts`

```typescript
import { z } from 'zod/v4';

export const productFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sortBy: z.enum(['price', 'rating', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type ProductFilterFormData = z.infer<typeof productFilterSchema>;
```

### 8.6 Create the Screen

**File:** `app/(main)/(tabs)/products.tsx`

```typescript
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { EmptyState } from '@/common/components/EmptyState';
import { Loading } from '@/common/components/Loading';
import { ScreenContainer } from '@/common/components/ScreenContainer';
import { Text } from '@/common/components/Text';
import { ProductCard } from '@/features/products/components';
import { useInfiniteProducts } from '@/features/products/hooks/useProducts';
import type { Product } from '@/features/products/types';

export default function ProductsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteProducts({ limit: 20 });

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  function handleProductPress(product: Product) {
    router.push(`/(main)/(tabs)/products/${product.id}`);
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ScreenContainer>
      <Text variant="heading1" style={styles.header}>
        {t('products.title')}
      </Text>
      <FlashList
        data={products}
        keyExtractor={(item) => item.id}
        estimatedItemSize={280}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={handleProductPress}
          />
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <EmptyState
            title={t('products.empty')}
            message={t('products.emptyMessage')}
          />
        }
        ListFooterComponent={isFetchingNextPage ? <Loading /> : null}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    paddingHorizontal: theme.metrics.spacing.p16,
    paddingTop: theme.metrics.spacing.p16,
    paddingBottom: theme.metrics.spacing.p8,
  },
}));
```

### 8.7 Add i18n Keys for the Feature

**File:** `src/i18n/locales/en.json` (add this section):

```json
"products": {
  "title": "Products",
  "empty": "No products found",
  "emptyMessage": "Try adjusting your search or filters",
  "addToCart": "Add to Cart",
  "outOfStock": "Out of Stock",
  "price": "Price",
  "category": "Category",
  "filter": "Filter",
  "sort": "Sort"
}
```

Mirror the same keys in `src/i18n/locales/ar.json` with Arabic translations.

### 8.8 Feature Directory Summary

After completing all steps, your feature directory should look like:

```
src/features/products/
├── components/
│   ├── ProductCard/
│   │   ├── ProductCard.tsx
│   │   ├── ProductCard.types.ts
│   │   ├── ProductCard.styles.ts
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   └── useProducts.ts
├── schemas/
│   └── productSchema.ts
├── services/
│   └── productService.ts
└── types/
    ├── product.types.ts
    └── index.ts
```

---

## 9. State Management Patterns

### 9.1 Decision Rule: Zustand vs React Query

Use this rule without exception:

| Data Type                                                                            | Use                                                         |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Server data (API responses, paginated lists, cached remote data)                     | React Query (`useQuery`, `useMutation`, `useInfiniteQuery`) |
| Client-only UI state (auth session, selected theme, cart contents, modal open/close) | Zustand                                                     |
| Form state                                                                           | react-hook-form (not either of the above)                   |

Never put server data in Zustand. Never put ephemeral UI state in React Query.

### 9.2 Creating a New Zustand Store

**Example: A cart store**

**File:** `src/features/cart/stores/cartStore.ts`

```typescript
import { create } from 'zustand';
import { setItem, getItem, STORAGE_KEYS } from '@/utils/storage';
import type { Product } from '@/features/products/types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.product.id === product.id);

      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return { items: updated };
      }

      return { items: [...state.items, { product, quantity }] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () => get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
}));
```

### 9.3 Creating React Query Mutation Hooks

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api/client';
import { productKeys } from './useProducts';
import type { Product } from '../types';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      const response = await api.post<Product>('/products', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all product list queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const response = await api.patch<Product>(`/products/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id), updatedProduct);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
```

### 9.4 Optimistic Updates Pattern

```typescript
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, isFavorite }: { productId: string; isFavorite: boolean }) => {
      const response = await api.post(`/products/${productId}/favorite`, { isFavorite });
      return response.data;
    },
    onMutate: async ({ productId, isFavorite }) => {
      // Cancel any in-flight queries for this product
      await queryClient.cancelQueries({ queryKey: productKeys.detail(productId) });

      // Snapshot the previous value
      const previousProduct = queryClient.getQueryData<Product>(productKeys.detail(productId));

      // Optimistically update the cache
      queryClient.setQueryData<Product>(productKeys.detail(productId), (old) =>
        old ? { ...old, isFavorite } : old
      );

      // Return context with snapshot for rollback
      return { previousProduct };
    },
    onError: (_error, { productId }, context) => {
      // Rollback on failure
      if (context?.previousProduct) {
        queryClient.setQueryData(productKeys.detail(productId), context.previousProduct);
      }
    },
    onSettled: (_data, _error, { productId }) => {
      // Always refetch after settle
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
}
```

### 9.5 Infinite Scroll Pattern

The `useInfiniteProducts` hook in section 8.3 implements infinite scroll. Use it with `FlashList` from `@shopify/flash-list` (not React Native's `FlatList`) for performance:

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteProducts();

// Flatten pages:
const items = data?.pages.flatMap((page) => page.data) ?? [];

// Trigger in FlashList:
<FlashList
  data={items}
  onEndReached={() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }}
  onEndReachedThreshold={0.5}
  ListFooterComponent={isFetchingNextPage ? <Loading /> : null}
/>
```

---

## 10. Deployment

### 10.1 EAS Build Setup

**File:** `eas.json`

The template ships with three profiles. Update the submit configuration with your real credentials:

```json
{
  "cli": {
    "version": ">= 15.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true },
      "env": { "EXPO_PUBLIC_APP_ENV": "development" }
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false },
      "env": { "EXPO_PUBLIC_APP_ENV": "staging" }
    },
    "production": {
      "autoIncrement": true,
      "env": { "EXPO_PUBLIC_APP_ENV": "production" }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "dev@yourcompany.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

- [ ] Step 1: Install EAS CLI: `npm install -g eas-cli`
- [ ] Step 2: Login: `eas login`
- [ ] Step 3: Link project: `eas project:init`
- [ ] Step 4: Set your real `projectId` in `app.json` under `extra.eas.projectId`

### 10.2 Set EAS Secrets

Never put production credentials in `eas.json`. Use EAS Secrets for sensitive values:

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY --value "eyJ..."
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://..."
```

### 10.3 Build Commands

```bash
# Development build (runs on simulator, includes dev menu)
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview build (internal distribution, real device)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all
```

### 10.4 iOS App Store Preparation

- [ ] Create your app in App Store Connect at https://appstoreconnect.apple.com
- [ ] Set the Bundle ID to match `app.json` `bundleIdentifier`
- [ ] Generate an App Store Connect API key and configure it in EAS
- [ ] Prepare screenshots for all required device sizes (6.9", 6.5", 5.5")
- [ ] Write app description, keywords, support URL
- [ ] Submit: `eas submit --profile production --platform ios`

### 10.5 Android Play Store Preparation

- [ ] Create your app in Google Play Console at https://play.google.com/console
- [ ] Set the package name to match `app.json` `package`
- [ ] Create a service account key and download the JSON file as `google-service-account.json`
- [ ] Add `google-service-account.json` to `.gitignore`
- [ ] Prepare store listing graphics (feature graphic 1024x500, icon 512x512)
- [ ] Submit: `eas submit --profile production --platform android`

### 10.6 OTA Updates

The template uses Expo's built-in OTA update capability via expo-router. For critical JS-only fixes that do not require a new native build:

```bash
# Publish an OTA update to production
eas update --branch production --message "Fix checkout flow crash"
```

OTA updates cannot be used to change native code, add new native dependencies, or modify `app.json` native configuration. Use a full EAS build for those changes.

---

## 11. Final Verification Checklist

Run through every item below after completing migration. No item should be skipped.

### Identity Verification

- [ ] `app.json` `name` is your app name (not "My App")
- [ ] `app.json` `slug` is URL-safe and unique to your app
- [ ] `app.json` `scheme` matches your deep link scheme
- [ ] `app.json` `bundleIdentifier` is your real reverse-domain ID
- [ ] `app.json` `package` matches `bundleIdentifier` for Android
- [ ] `package.json` `name` is updated
- [ ] All assets in `assets/images/` have been replaced
- [ ] Splash screen background colors in `app.json` match brand colors

### Theme Verification

- [ ] `src/theme/light-theme.ts` has no `#6366F1` Indigo values (unless you kept the default theme)
- [ ] `src/theme/dark-theme.ts` dark-mode colors are legible variants of light-mode brand colors
- [ ] `src/theme/fonts.ts` uses your chosen font family (or `'System'` if staying default)
- [ ] App renders correctly in both light and dark mode

### i18n Verification

- [ ] `src/i18n/locales/en.json` has no `showcase` key
- [ ] All new feature keys are present in both `en.json` and `ar.json` (or whichever locales you support)
- [ ] Every translation key used with `t('...')` in components has a matching entry in the JSON files

### Backend Verification

- [ ] `.env` file exists and has real credentials (not the example placeholders)
- [ ] `.env` is listed in `.gitignore`
- [ ] `src/config/env.ts` has all required variables defined
- [ ] API base URL points to your real backend (not `https://api.example.com`)
- [ ] App boots without Supabase warnings in dev console (if credentials are set)

### Navigation Verification

- [ ] All new tab screens are registered in `app/(main)/(tabs)/_layout.tsx`
- [ ] Tab icons are set using `@expo/vector-icons`
- [ ] Tab labels use `t()` translation keys
- [ ] Auth screens are unreachable when user is authenticated
- [ ] Protected screens are unreachable when user is not authenticated

### Code Quality Verification

- [ ] `npm run validate` passes with zero errors
- [ ] No `any` types in new code
- [ ] No inline styles in new components (all styles use `StyleSheet.create`)
- [ ] No hardcoded color literals in new components (all colors via `theme.colors.*`)
- [ ] No hardcoded UI strings (all user-facing text via `t()`)
- [ ] All new component files follow the `Component/Component.tsx` + `index.ts` pattern
- [ ] All new feature modules follow the `src/features/<name>/` directory structure

### Build Verification

- [ ] `npm start` and the app renders on simulator without errors
- [ ] `npm run ios` or `npm run android` compiles successfully
- [ ] Dark mode toggle in Settings works and applies correct colors
- [ ] Language switching (if supported) works and triggers RTL correctly for Arabic

> **Common Mistake:** Running `npm run validate` only at the end. Run it after completing each major section (identity, theme, i18n, navigation, features) to catch errors early before they compound.
